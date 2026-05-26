import { Inject, Injectable } from '@nestjs/common'
import { REDIS_CLIENT } from '@ecom/redis'
import type Redis from 'ioredis'
import type { ChannelDeliveryResult, NotificationDeliveryPayload } from './types'

@Injectable()
export class InAppChannel {
  constructor(@Inject(REDIS_CLIENT) private readonly redis: Redis) {}

  async deliver(payload: NotificationDeliveryPayload): Promise<ChannelDeliveryResult> {
    const message = JSON.stringify({
      id: payload.notificationId,
      type: payload.type,
      title: payload.title,
      message: payload.message,
      createdAt: new Date().toISOString(),
      ...(payload.metadata !== undefined ? { metadata: payload.metadata } : {}),
    })

    if (payload.target.kind === 'user') {
      await this.redis.publish(`notif:user:${payload.target.userId}`, message)
      return { channel: 'IN_APP', status: 'DELIVERED' }
    }

    await this.redis.publish(`notif:shop:${payload.target.shopId}`, message)
    return { channel: 'IN_APP', status: 'DELIVERED' }
  }
}
