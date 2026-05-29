import type { OnGatewayInit } from '@nestjs/websockets'
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets'
import { Inject, type OnModuleDestroy } from '@nestjs/common'
import type { Server, Socket } from 'socket.io'
import { resolveSocketCorsOrigins, toSocketError } from '@ecom/nestjs-core'
import { REDIS_CLIENT } from '@ecom/redis'
import type Redis from 'ioredis'
import { BaseChatGateway, SESSION_SERVICE } from '@ecom/chat'
import type { SessionService } from '@ecom/auth'
import { ChatBuyerService } from './chat-buyer.service'

const USER_NOTIFICATION_CHANNEL = 'notif:user:'

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

function extractUserIdFromNotificationChannel(channel: string): string | undefined {
  if (!channel.startsWith(USER_NOTIFICATION_CHANNEL)) {
    return undefined
  }
  const userId = channel.slice(USER_NOTIFICATION_CHANNEL.length)
  return userId.length > 0 ? userId : undefined
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
export class ChatGateway extends BaseChatGateway implements OnGatewayInit, OnModuleDestroy {
  @WebSocketServer()
  server!: Server

  private notificationSubscriber: Redis | undefined

  constructor(
    private readonly chatBuyerService: ChatBuyerService,
    @Inject(SESSION_SERVICE) sessionService: SessionService,
    @Inject(REDIS_CLIENT) redis: Redis,
  ) {
    super(sessionService, redis)
  }

  protected getIdentityFromSession(session: Record<string, unknown>): string | undefined {
    return session.userId as string | undefined
  }

  protected async onAuthenticated(client: Socket, userId: string): Promise<void> {
    client.data.userId = userId
    void client.join(`user:${userId}`)
  }

  protected getIdentityFromSocketData(client: Socket): string | undefined {
    return (client.data as { userId?: string }).userId
  }

  protected getPresenceScope(): string {
    return 'user'
  }

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

  override async onModuleDestroy(): Promise<void> {
    if (this.notificationSubscriber) {
      await this.notificationSubscriber.quit()
      this.notificationSubscriber = undefined
    }
  }

  @SubscribeMessage('join_conversation')
  async handleJoinConversation(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { conversationId: string },
  ): Promise<void> {
    const userId = (client.data as { userId?: string }).userId
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
    const userId = (client.data as { userId?: string }).userId
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
    const userId = (client.data as { userId?: string }).userId
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
    const userId = (client.data as { userId?: string }).userId
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
    const userId = (client.data as { userId?: string }).userId
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
