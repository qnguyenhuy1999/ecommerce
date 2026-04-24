import { getRedis } from './index'

export async function getCartRedis(key: string): Promise<Record<string, unknown> | null> {
  const redis = getRedis()
  const raw = await redis.get(key)
  if (!raw) return null
  try {
    return JSON.parse(raw) as Record<string, unknown>
  } catch {
    return null
  }
}

export async function setCartRedis(key: string, data: unknown, ttlSeconds = 86400): Promise<void> {
  const redis = getRedis()
  await redis.setex(key, ttlSeconds, JSON.stringify(data))
}

export async function deleteCartRedis(key: string): Promise<void> {
  const redis = getRedis()
  await redis.del(key)
}
