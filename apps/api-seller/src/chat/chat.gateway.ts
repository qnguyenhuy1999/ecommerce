import type { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit } from '@nestjs/websockets'
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets'
import { Inject, Logger, type OnModuleDestroy } from '@nestjs/common'
import type { Server, Socket } from 'socket.io'
import type { SessionService} from '@ecom/auth';
import { SESSION_COOKIE_NAME } from '@ecom/auth'
import {
  createPresenceKey,
  extractSocketSessionId,
  resolveSocketCorsOrigins,
  toSocketError,
} from '@ecom/nestjs-core'
import { REDIS_CLIENT } from '@ecom/redis'
import type Redis from 'ioredis'
import type { ChatService } from './chat.service'
import type { ShopService } from '../shop/shop.service'
import { SESSION_SERVICE } from '../auth/session.provider'

interface SellerChatSocketData {
  userId?: string
  shopId?: string
  sellerProfileId?: string
}

const SHOP_NOTIFICATION_CHANNEL = 'notif:shop:'
const PRESENCE_TTL_SECONDS = 60

interface ChatErrorPayload {
  code: 'FORBIDDEN' | 'NOT_FOUND' | 'INTERNAL'
  message: string
}

function getSocketData(client: Socket): SellerChatSocketData {
  return client.data as SellerChatSocketData
}
function extractShopIdFromNotificationChannel(channel: string): string | undefined {
  if (!channel.startsWith(SHOP_NOTIFICATION_CHANNEL)) {
    return undefined
  }

  const shopId = channel.slice(SHOP_NOTIFICATION_CHANNEL.length)
  return shopId.length > 0 ? shopId : undefined
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

  private notificationSubscriber: Redis | undefined
  private readonly logger = new Logger(ChatGateway.name)

  constructor(
    private readonly shopService: ShopService,
    private readonly chatService: ChatService,
    @Inject(SESSION_SERVICE)
    private readonly sessionService: SessionService,
    @Inject(REDIS_CLIENT)
    private readonly redis: Redis,
  ) {}
  afterInit(): void {
    this.notificationSubscriber = this.redis.duplicate()
    this.notificationSubscriber.on('pmessage', (_pattern, channel, rawMessage) => {
      const shopId = extractShopIdFromNotificationChannel(channel)
      if (!shopId) return

      try {
        const payload = JSON.parse(rawMessage) as {
          id: string
          type: string
          title: string
          message: string
          createdAt: string
          metadata?: Record<string, unknown>
        }
        this.server.to(`shop:${shopId}`).emit('notification', payload)
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'unknown error'
        this.logger.warn(`Failed to relay seller notification on ${channel}: ${message}`)
      }
    })
    this.notificationSubscriber.on('error', (err: Error) => {
      this.logger.error(`Seller notification subscriber error: ${err.message}`)
    })
    void this.notificationSubscriber.psubscribe(`${SHOP_NOTIFICATION_CHANNEL}*`)
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
      this.logger.warn(`Chat WS session lookup failed: ${message}`)
      client.disconnect(true)
      return
    }

    if (!session || typeof session !== 'object') {
      client.disconnect(true)
      return
    }

    const userIdRaw = (session as Record<string, unknown>).userId
    const sellerProfileIdRaw = (session as Record<string, unknown>).sellerProfileId

    if (typeof userIdRaw !== 'string' || userIdRaw.length === 0) {
      client.disconnect(true)
      return
    }

    const socketData = getSocketData(client)
    socketData.userId = userIdRaw
    if (typeof sellerProfileIdRaw === 'string' && sellerProfileIdRaw.length > 0) {
      socketData.sellerProfileId = sellerProfileIdRaw
    }
    try {
      socketData.shopId = await this.shopService.getShopId(userIdRaw)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'unknown error'
      this.logger.warn(`Chat WS shop lookup failed: ${message}`)
      client.disconnect(true)
      return
    }

    await this.trackPresence(userIdRaw, client.id)
    if (socketData.shopId) {
      void client.join(`shop:${socketData.shopId}`)
    }
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
  ) {
    const userId = getSocketData(client).userId
    if (typeof userId !== 'string' || userId.length === 0) return

    try {
      await this.chatService.ensureConversationAccessByUser(userId, data.conversationId)
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
  ) {
    const userId = getSocketData(client).userId
    if (typeof userId !== 'string' || userId.length === 0) return
    void client.leave(`conversation:${data.conversationId}`)
  }

  @SubscribeMessage('send_message')
  async handleSendMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    data: {
      shopId: string
      conversationId: string
      content: string
      type?: 'TEXT' | 'IMAGE' | 'PRODUCT'
    },
  ) {
    const userId = getSocketData(client).userId
    if (typeof userId !== 'string' || userId.length === 0) return

    try {
      const message = await this.chatService.sendMessage(
        userId,
        data.shopId,
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
  ) {
    const userId = getSocketData(client).userId
    if (typeof userId !== 'string' || userId.length === 0) return

    try {
      await this.chatService.ensureConversationAccessByUser(userId, data.conversationId)
    } catch {
      // Swallow silently for high-frequency event; the client will already be
      // blocked from join_conversation / send_message if they lack access.
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
    @MessageBody() data: { shopId: string; conversationId: string },
  ) {
    const userId = getSocketData(client).userId
    if (typeof userId !== 'string' || userId.length === 0) return

    try {
      await this.chatService.markAsRead(userId, data.shopId, data.conversationId)
      this.server.to(`conversation:${data.conversationId}`).emit('messages_read', {
        conversationId: data.conversationId,
      })
    } catch (err: unknown) {
      client.emit('chat_error', toChatError(err))
    }
  }
}
