import type { OnGatewayInit } from '@nestjs/websockets'
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets'
import { Inject, type OnModuleDestroy } from '@nestjs/common'
import type { Server, Socket } from 'socket.io'
import type { SessionService } from '@ecom/auth'
import { resolveSocketCorsOrigins, toSocketError } from '@ecom/nestjs-core'
import { REDIS_CLIENT } from '@ecom/redis'
import type Redis from 'ioredis'
import { BaseChatGateway, SESSION_SERVICE } from '@ecom/nestjs-core/chat'
import { ChatService } from './chat.service'
import { ShopService } from '../shop/shop.service'

interface SellerChatSocketData {
  userId?: string
  shopId?: string
  sellerProfileId?: string
}

const SHOP_NOTIFICATION_CHANNEL = 'notif:shop:'

interface ChatErrorPayload {
  code: 'FORBIDDEN' | 'NOT_FOUND' | 'INTERNAL'
  message: string
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
export class ChatGateway extends BaseChatGateway implements OnGatewayInit, OnModuleDestroy {
  @WebSocketServer()
  server!: Server

  private notificationSubscriber: Redis | undefined

  constructor(
    @Inject(ShopService) private readonly shopService: ShopService,
    @Inject(ChatService) private readonly chatService: ChatService,
    @Inject(SESSION_SERVICE) sessionService: SessionService,
    @Inject(REDIS_CLIENT) redis: Redis,
  ) {
    super(sessionService, redis)
  }

  protected getIdentityFromSession(session: Record<string, unknown>): string | undefined {
    return session.userId as string | undefined
  }

  protected async onAuthenticated(
    client: Socket,
    userId: string,
    session: Record<string, unknown>,
  ): Promise<void> {
    const socketData = client.data as SellerChatSocketData
    socketData.userId = userId

    const sellerProfileIdRaw = session.sellerProfileId
    if (typeof sellerProfileIdRaw === 'string' && sellerProfileIdRaw.length > 0) {
      socketData.sellerProfileId = sellerProfileIdRaw
    }

    try {
      socketData.shopId = await this.shopService.getShopId(userId)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'unknown error'
      this.logger.warn(`Chat WS shop lookup failed: ${message}`)
      client.disconnect(true)
      return
    }

    if (socketData.shopId) {
      void client.join(`shop:${socketData.shopId}`)
    }
    void client.join(`user:${userId}`)
  }

  protected getIdentityFromSocketData(client: Socket): string | undefined {
    return (client.data as SellerChatSocketData).userId
  }

  protected getPresenceScope(): string {
    return 'user'
  }

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
  ) {
    const userId = (client.data as SellerChatSocketData).userId
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
    const userId = (client.data as SellerChatSocketData).userId
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
    const userId = (client.data as SellerChatSocketData).userId
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
    const userId = (client.data as SellerChatSocketData).userId
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
    const userId = (client.data as SellerChatSocketData).userId
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
