import Redis from 'ioredis'

import { REDIS_HOST, REDIS_PORT, REDIS_PASSWORD } from './env'

let redis: Redis | null = null

export function getRedis(): Redis {
  if (!redis) {
    redis = new Redis({
      host: REDIS_HOST || 'localhost',
      port: parseInt(REDIS_PORT || '6379', 10),
      password: REDIS_PASSWORD || undefined,
      maxRetriesPerRequest: 3,
      retryStrategy: (times) => Math.min(times * 50, 2000),
    })

    redis.on('error', (err) => {
      console.error('[Redis] Connection error:', err)
    })

    redis.on('connect', () => {
      console.log('[Redis] Connected')
    })
  }
  return redis
}

export async function closeRedis(): Promise<void> {
  if (redis) {
    await redis.quit()
    redis = null
  }
}

export { getCartRedis, setCartRedis, deleteCartRedis } from './cart'
