import { Inject, Logger } from '@nestjs/common'
import { ConnectedSocket, SubscribeMessage } from '@nestjs/websockets'
import type { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets'
import type { Server, Socket } from 'socket.io'
import type { SessionService } from '@ecom/auth/session.service'
import { SESSION_COOKIE_NAME } from '@ecom/auth/cookie.config'
import { createPresenceKey, extractSocketSessionId } from '../nestjs/websocket/chat-gateway.utils'
import { REDIS_CLIENT } from '@ecom/redis'
import type Redis from 'ioredis'

/**
 * Injection token for the SessionService.
 * Each app must provide this token via its own SessionProvider.
 */
export const SESSION_SERVICE = 'SESSION_SERVICE'

const PRESENCE_TTL_SECONDS = 60

export abstract class BaseChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  protected abstract readonly server: Server

  protected readonly logger = new Logger(this.constructor.name)

  constructor(
    @Inject(SESSION_SERVICE) protected readonly sessionService: SessionService,
    @Inject(REDIS_CLIENT) protected readonly redis: Redis,
  ) {}

  /**
   * Extract the identity (e.g. userId, sellerId) from a validated session object.
   * Return undefined to reject the connection.
   */
  protected abstract getIdentityFromSession(session: Record<string, unknown>): string | undefined

  /**
   * Called after a socket is authenticated. Subclasses join rooms and set socket data here.
   */
  protected abstract onAuthenticated(
    client: Socket,
    identity: string,
    session: Record<string, unknown>,
  ): Promise<void>

  /**
   * Retrieve the identity stored on the socket's data after authentication.
   * Return undefined if the socket was never authenticated.
   */
  protected abstract getIdentityFromSocketData(client: Socket): string | undefined

  /**
   * The presence scope label used in Redis keys (e.g. 'user', 'seller').
   */
  protected abstract getPresenceScope(): string

  protected async trackPresence(scope: string, identity: string, socketId: string): Promise<void> {
    try {
      const key = createPresenceKey(scope, identity)
      await this.redis.sadd(key, socketId)
      await this.redis.expire(key, PRESENCE_TTL_SECONDS)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'unknown error'
      this.logger.warn(`Failed to track presence for ${identity}: ${message}`)
    }
  }

  protected async untrackPresence(
    scope: string,
    identity: string,
    socketId: string,
  ): Promise<void> {
    try {
      await this.redis.srem(createPresenceKey(scope, identity), socketId)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'unknown error'
      this.logger.warn(`Failed to untrack presence for ${identity}: ${message}`)
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
      this.logger.warn(`WS session lookup failed: ${message}`)
      client.disconnect(true)
      return
    }

    if (!session || typeof session !== 'object') {
      client.disconnect(true)
      return
    }

    const sessionRecord = session as Record<string, unknown>
    const identity = this.getIdentityFromSession(sessionRecord)
    if (!identity) {
      client.disconnect(true)
      return
    }

    await this.onAuthenticated(client, identity, sessionRecord)
    await this.trackPresence(this.getPresenceScope(), identity, client.id)
  }

  async handleDisconnect(client: Socket): Promise<void> {
    const identity = this.getIdentityFromSocketData(client)
    if (typeof identity === 'string' && identity.length > 0) {
      await this.untrackPresence(this.getPresenceScope(), identity, client.id)
    }
  }

  @SubscribeMessage('heartbeat')
  async handleHeartbeat(@ConnectedSocket() client: Socket): Promise<void> {
    const identity = this.getIdentityFromSocketData(client)
    if (typeof identity !== 'string' || identity.length === 0) return

    try {
      await this.redis.expire(
        createPresenceKey(this.getPresenceScope(), identity),
        PRESENCE_TTL_SECONDS,
      )
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'unknown error'
      this.logger.warn(`Failed to refresh presence for ${identity}: ${message}`)
    }
  }

  async onModuleDestroy(): Promise<void> {
    // no-op — subclasses override when they hold resources (e.g. subscriber connections)
  }
}
