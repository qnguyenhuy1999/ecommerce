export function getCartRedis(_key: string): Promise<Record<string, unknown> | null> {
  // TODO(@platform, 2026-04-23): Implement Redis GET for cart data.
  return Promise.resolve(null)
}

export function setCartRedis(_key: string, _data: unknown, _ttlSeconds = 86400): Promise<void> {
  // TODO(@platform, 2026-04-23): Implement Redis SETEX for cart data (with TTL).
  return Promise.resolve()
}

export function deleteCartRedis(_key: string): Promise<void> {
  // TODO(@platform, 2026-04-23): Implement Redis DEL for cart data.
  return Promise.resolve()
}
