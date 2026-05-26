import { Inject, Injectable } from '@nestjs/common'
import { REDIS_CLIENT } from '@ecom/redis'
import type Redis from 'ioredis'
import type { ChannelDeliveryResult, NotificationDeliveryPayload } from './types'

@Injectable()
export class InAppChannel {
  constructor(@Inject(REDIS_CLIENT) private readonly redis: Redis) {}

  async deliver(payload: NotificationDeliveryPayload): Promise<ChannelDeliveryResult> {
    if (payload.target.kind !== 'user') {
      return { channel: 'IN_APP', status: 'DELIVERED' }
    }

    const message = JSON.stringify({
      type: payload.type,
      title: payload.title,
      message: payload.message,
      ...(payload.metadata !== undefined ? { metadata: payload.metadata } : {}),
    })

    await this.redis.publish(`notif:user:${payload.target.userId}`, message)
    return { channel: 'IN_APP', status: 'DELIVERED' }
  }
}
