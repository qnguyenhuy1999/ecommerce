import type { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets'
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets'
import { Inject, Logger } from '@nestjs/common'
import type { Server, Socket } from 'socket.io'
import type { SessionService } from '@ecom/auth'
import { SESSION_COOKIE_NAME } from '@ecom/auth'
import {
  createPresenceKey,
  extractSocketSessionId,
  resolveSocketCorsOrigins,
  toSocketError,
} from '@ecom/nestjs-core'
import { REDIS_CLIENT } from '@ecom/redis'
import type Redis from 'ioredis'
import type { ChatAdminService } from './chat-admin.service'
import { SESSION_SERVICE } from '../auth/session.provider'

interface AdminChatSocketData {
  adminId?: string
}

const PRESENCE_TTL_SECONDS = 60

interface ChatErrorPayload {
  code: 'NOT_FOUND' | 'INTERNAL'
  message: string
}

function getSocketData(client: Socket): AdminChatSocketData {
  return client.data as AdminChatSocketData
}

function toChatError(err: unknown): ChatErrorPayload {
  return toSocketError(err, { 404: 'NOT_FOUND' }, 'Chat operation failed', 'INTERNAL')
}

@WebSocketGateway({
  cors: { origin: resolveSocketCorsOrigins(), credentials: true },
  namespace: '/chat',
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server

  private readonly logger = new Logger(ChatGateway.name)

  constructor(
    private readonly chatAdminService: ChatAdminService,
    @Inject(SESSION_SERVICE)
    private readonly sessionService: SessionService,
    @Inject(REDIS_CLIENT)
    private readonly redis: Redis,
  ) {}

  private async trackPresence(adminId: string, socketId: string): Promise<void> {
    try {
      const key = createPresenceKey('admin', adminId)
      await this.redis.sadd(key, socketId)
      await this.redis.expire(key, PRESENCE_TTL_SECONDS)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'unknown error'
      this.logger.warn(`Failed to track admin presence for ${adminId}: ${message}`)
    }
  }

  private async untrackPresence(adminId: string, socketId: string): Promise<void> {
    try {
      await this.redis.srem(createPresenceKey('admin', adminId), socketId)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'unknown error'
      this.logger.warn(`Failed to untrack admin presence for ${adminId}: ${message}`)
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
      this.logger.warn(`Admin chat WS session lookup failed: ${message}`)
      client.disconnect(true)
      return
    }

    if (!session || typeof session !== 'object') {
      client.disconnect(true)
      return
    }

    const adminIdRaw = (session as Record<string, unknown>).adminId
    if (typeof adminIdRaw !== 'string' || adminIdRaw.length === 0) {
      client.disconnect(true)
      return
    }

    getSocketData(client).adminId = adminIdRaw
    await this.trackPresence(adminIdRaw, client.id)
    void client.join(`admin:${adminIdRaw}`)
  }

  async handleDisconnect(client: Socket): Promise<void> {
    const adminId = getSocketData(client).adminId
    if (typeof adminId === 'string' && adminId.length > 0) {
      await this.untrackPresence(adminId, client.id)
    }
  }

  @SubscribeMessage('heartbeat')
  async handleHeartbeat(@ConnectedSocket() client: Socket): Promise<void> {
    const adminId = getSocketData(client).adminId
    if (typeof adminId !== 'string' || adminId.length === 0) return

    try {
      await this.redis.expire(createPresenceKey('admin', adminId), PRESENCE_TTL_SECONDS)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'unknown error'
      this.logger.warn(`Failed to refresh admin presence for ${adminId}: ${message}`)
    }
  }

  @SubscribeMessage('join_conversation')
  async handleJoinConversation(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { conversationId: string },
  ): Promise<void> {
    const adminId = getSocketData(client).adminId
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
    const adminId = getSocketData(client).adminId
    if (typeof adminId !== 'string' || adminId.length === 0) return

    void client.leave(`conversation:${data.conversationId}`)
  }

  @SubscribeMessage('typing')
  async handleTyping(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { conversationId: string },
  ): Promise<void> {
    const adminId = getSocketData(client).adminId
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
