import type { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit } from '@nestjs/websockets'
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets'
import { Inject, Logger, type OnModuleDestroy } from '@nestjs/common'
import type { Server, Socket } from 'socket.io'
import { SessionService } from '@ecom/auth'
import { SESSION_COOKIE_NAME } from '@ecom/auth'
import {
  createPresenceKey,
  extractSocketSessionId,
  resolveSocketCorsOrigins,
  toSocketError,
} from '@ecom/nestjs-core'
import { REDIS_CLIENT } from '@ecom/redis'
import type Redis from 'ioredis'
import { ChatBuyerService } from './chat-buyer.service'
import { SESSION_SERVICE } from '../auth/session.provider'

interface StorefrontChatSocketData {
  userId?: string
}

const PRESENCE_TTL_SECONDS = 60
const USER_NOTIFICATION_CHANNEL = 'notif:user:'

function extractUserIdFromNotificationChannel(channel: string): string | undefined {
  if (!channel.startsWith(USER_NOTIFICATION_CHANNEL)) {
    return undefined
  }

  const userId = channel.slice(USER_NOTIFICATION_CHANNEL.length)
  return userId.length > 0 ? userId : undefined
}

interface ChatErrorPayload {
  code: 'FORBIDDEN' | 'NOT_FOUND' | 'INTERNAL'
  message: string
}

interface UserNotificationPayload {
  id: string
  type: string
  title: string
  message: string
  createdAt: string
  metadata?: Record<string, unknown>
}

function getSocketData(client: Socket): StorefrontChatSocketData {
  return client.data as StorefrontChatSocketData
}

function toChatError(err: unknown): ChatErrorPayload {
  return toSocketError(
    err,
    { 403: 'FORBIDDEN', 404: 'NOT_FOUND' },
    'Chat operation failed',
    'INTERNAL',
  )
}

@WebSocketGateway({
  cors: { origin: resolveSocketCorsOrigins(), credentials: true },
  namespace: '/chat',
})
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect, OnModuleDestroy
{
  @WebSocketServer()
  server!: Server

  private readonly logger = new Logger(ChatGateway.name)
  private notificationSubscriber: Redis | undefined

  constructor(
    private readonly chatBuyerService: ChatBuyerService,
    @Inject(SESSION_SERVICE)
    private readonly sessionService: SessionService,
    @Inject(REDIS_CLIENT)
    private readonly redis: Redis,
  ) {}

  afterInit(): void {
    this.notificationSubscriber = this.redis.duplicate()
    this.notificationSubscriber.on('pmessage', (_pattern, channel, rawMessage) => {
      const userId = extractUserIdFromNotificationChannel(channel)
      if (!userId) return

      try {
        const payload = JSON.parse(rawMessage) as UserNotificationPayload
        this.server.to(`user:${userId}`).emit('notification', payload)
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'unknown error'
        this.logger.warn(`Failed to relay notification on ${channel}: ${message}`)
      }
    })
    this.notificationSubscriber.on('error', (err: Error) => {
      this.logger.error(`Notification subscriber error: ${err.message}`)
    })
    void this.notificationSubscriber.psubscribe(`${USER_NOTIFICATION_CHANNEL}*`)
  }

  async onModuleDestroy(): Promise<void> {
    if (this.notificationSubscriber) {
      await this.notificationSubscriber.quit()
      this.notificationSubscriber = undefined
    }
  }

  private async trackPresence(userId: string, socketId: string): Promise<void> {
    try {
      const key = createPresenceKey('user', userId)
      await this.redis.sadd(key, socketId)
      await this.redis.expire(key, PRESENCE_TTL_SECONDS)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'unknown error'
      this.logger.warn(`Failed to track presence for ${userId}: ${message}`)
    }
  }

  private async untrackPresence(userId: string, socketId: string): Promise<void> {
    try {
      await this.redis.srem(createPresenceKey('user', userId), socketId)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'unknown error'
      this.logger.warn(`Failed to untrack presence for ${userId}: ${message}`)
    }
  }

  async handleConnection(client: Socket): Promise<void> {
    const sessionId = extractSocketSessionId(client, SESSION_COOKIE_NAME)
    if (!sessionId) {
      client.disconnect(true)
      return
    }

    let session: unknown
    try {
      session = await this.sessionService.get(sessionId)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'unknown error'
      this.logger.warn(`Storefront chat WS session lookup failed: ${message}`)
      client.disconnect(true)
      return
    }

    if (!session || typeof session !== 'object') {
      client.disconnect(true)
      return
    }

    const userIdRaw = (session as Record<string, unknown>).userId
    if (typeof userIdRaw !== 'string' || userIdRaw.length === 0) {
      client.disconnect(true)
      return
    }

    getSocketData(client).userId = userIdRaw
    await this.trackPresence(userIdRaw, client.id)
    void client.join(`user:${userIdRaw}`)
  }

  async handleDisconnect(client: Socket): Promise<void> {
    const userId = getSocketData(client).userId
    if (typeof userId === 'string' && userId.length > 0) {
      await this.untrackPresence(userId, client.id)
    }
  }

  @SubscribeMessage('heartbeat')
  async handleHeartbeat(@ConnectedSocket() client: Socket): Promise<void> {
    const userId = getSocketData(client).userId
    if (typeof userId !== 'string' || userId.length === 0) return

    try {
      await this.redis.expire(createPresenceKey('user', userId), PRESENCE_TTL_SECONDS)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'unknown error'
      this.logger.warn(`Failed to refresh presence for ${userId}: ${message}`)
    }
  }

  @SubscribeMessage('join_conversation')
  async handleJoinConversation(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { conversationId: string },
  ): Promise<void> {
    const userId = getSocketData(client).userId
    if (typeof userId !== 'string' || userId.length === 0) return

    try {
      await this.chatBuyerService.ensureConversationAccessByUser(userId, data.conversationId)
    } catch (err: unknown) {
      client.emit('chat_error', toChatError(err))
      return
    }

    void client.join(`conversation:${data.conversationId}`)
  }

  @SubscribeMessage('leave_conversation')
  handleLeaveConversation(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { conversationId: string },
  ): void {
    const userId = getSocketData(client).userId
    if (typeof userId !== 'string' || userId.length === 0) return

    void client.leave(`conversation:${data.conversationId}`)
  }

  @SubscribeMessage('send_message')
  async handleSendMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    data: {
      conversationId: string
      content: string
      type?: 'TEXT' | 'IMAGE' | 'PRODUCT'
    },
  ): Promise<void> {
    const userId = getSocketData(client).userId
    if (typeof userId !== 'string' || userId.length === 0) return

    try {
      const message = await this.chatBuyerService.sendMessage(
        userId,
        data.conversationId,
        data.content,
        data.type,
      )
      this.server.to(`conversation:${data.conversationId}`).emit('new_message', message)
    } catch (err: unknown) {
      client.emit('chat_error', toChatError(err))
    }
  }

  @SubscribeMessage('typing')
  async handleTyping(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { conversationId: string },
  ): Promise<void> {
    const userId = getSocketData(client).userId
    if (typeof userId !== 'string' || userId.length === 0) return

    try {
      await this.chatBuyerService.ensureConversationAccessByUser(userId, data.conversationId)
    } catch {
      return
    }

    client.to(`conversation:${data.conversationId}`).emit('user_typing', {
      userId,
      conversationId: data.conversationId,
    })
  }

  @SubscribeMessage('mark_read')
  async handleMarkRead(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { conversationId: string },
  ): Promise<void> {
    const userId = getSocketData(client).userId
    if (typeof userId !== 'string' || userId.length === 0) return

    try {
      await this.chatBuyerService.markAsRead(userId, data.conversationId)
      this.server.to(`conversation:${data.conversationId}`).emit('messages_read', {
        conversationId: data.conversationId,
      })
    } catch (err: unknown) {
      client.emit('chat_error', toChatError(err))
    }
  }
}
