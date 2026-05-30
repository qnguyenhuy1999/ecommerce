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
import type { SessionService } from '@ecom/auth/session.service'
import {
  resolveSocketCorsOrigins,
  toSocketError,
} from '@ecom/nestjs-core/nestjs/websocket/chat-gateway.utils'
import { REDIS_CLIENT } from '@ecom/redis'
import type Redis from 'ioredis'
import { BaseChatGateway, SESSION_SERVICE } from '@ecom/nestjs-core/chat/base-chat.gateway'
import { ChatAdminService } from './chat-admin.service'
import { CHAT_MESSAGE_CREATED_CHANNEL } from '@ecom/shared/constants/events'

interface AdminChatSocketData {
  adminId?: string
}

const ADMIN_ROOM = 'admins'

function extractMessageIdFromChatEvent(rawMessage: string): string | undefined {
  try {
    const payload = JSON.parse(rawMessage) as { messageId?: unknown }
    return typeof payload.messageId === 'string' && payload.messageId.length > 0
      ? payload.messageId
      : undefined
  } catch {
    return undefined
  }
}

interface ChatErrorPayload {
  code: 'NOT_FOUND' | 'INTERNAL'
  message: string
}

function toChatError(err: unknown): ChatErrorPayload {
  return toSocketError(err, { 404: 'NOT_FOUND' }, 'Chat operation failed', 'INTERNAL')
}

function getAdminIdFromSession(session: Record<string, unknown>): string | undefined {
  const adminId = session['adminId']
  return typeof adminId === 'string' && adminId.length > 0 ? adminId : undefined
}

function getAdminSocketData(client: Socket): AdminChatSocketData | undefined {
  const data = client.data as Record<string, unknown>
  const adminId = data['adminId']

  return typeof adminId === 'string' && adminId.length > 0 ? { adminId } : undefined
}

function setAdminSocketData(client: Socket, adminId: string): void {
  const data = client.data as Record<string, unknown>
  data['adminId'] = adminId
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
    private readonly chatAdminService: ChatAdminService,
    @Inject(SESSION_SERVICE) sessionService: SessionService,
    @Inject(REDIS_CLIENT) redis: Redis,
  ) {
    super(sessionService, redis)
  }

  protected getIdentityFromSession(session: Record<string, unknown>): string | undefined {
    return getAdminIdFromSession(session)
  }

  protected async onAuthenticated(
    client: Socket,
    adminId: string,
    _session: Record<string, unknown>,
  ): Promise<void> {
    setAdminSocketData(client, adminId)
    await Promise.all([client.join(`admin:${adminId}`), client.join(ADMIN_ROOM)])
  }

  protected getIdentityFromSocketData(client: Socket): string | undefined {
    return getAdminSocketData(client)?.adminId
  }

  protected getPresenceScope(): string {
    return 'admin'
  }

  afterInit(): void {
    this.notificationSubscriber = this.redis.duplicate()
    this.notificationSubscriber.on('message', (channel, rawMessage) => {
      if (channel !== CHAT_MESSAGE_CREATED_CHANNEL) {
        return
      }

      const messageId = extractMessageIdFromChatEvent(rawMessage)
      if (!messageId) {
        return
      }

      void this.broadcastIncomingMessage(messageId)
    })
    this.notificationSubscriber.on('error', (err: Error) => {
      this.logger.error(`Admin chat notification subscriber error: ${err.message}`)
    })
    void this.notificationSubscriber.subscribe(CHAT_MESSAGE_CREATED_CHANNEL)
  }

  override async onModuleDestroy(): Promise<void> {
    if (this.notificationSubscriber) {
      await this.notificationSubscriber.quit()
      this.notificationSubscriber = undefined
    }
  }

  private async broadcastIncomingMessage(messageId: string): Promise<void> {
    try {
      const message = await this.chatAdminService.getMessage(messageId)
      this.server.to(ADMIN_ROOM).emit('new_message', message)
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'unknown error'
      this.logger.warn(`Failed to broadcast admin chat message ${messageId}: ${errorMessage}`)
    }
  }

  @SubscribeMessage('join_conversation')
  async handleJoinConversation(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { conversationId: string },
  ): Promise<void> {
    const adminId = getAdminSocketData(client)?.adminId
    if (typeof adminId !== 'string' || adminId.length === 0) return

    try {
      await this.chatAdminService.ensureConversationExists(data.conversationId)
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
    const adminId = getAdminSocketData(client)?.adminId
    if (typeof adminId !== 'string' || adminId.length === 0) return

    void client.leave(`conversation:${data.conversationId}`)
  }

  @SubscribeMessage('typing')
  async handleTyping(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { conversationId: string },
  ): Promise<void> {
    const adminId = getAdminSocketData(client)?.adminId
    if (typeof adminId !== 'string' || adminId.length === 0) return

    try {
      await this.chatAdminService.ensureConversationExists(data.conversationId)
    } catch {
      return
    }

    client.to(`conversation:${data.conversationId}`).emit('user_typing', {
      adminId,
      conversationId: data.conversationId,
    })
  }
}
