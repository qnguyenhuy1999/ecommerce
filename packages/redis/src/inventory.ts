import { getRedis } from './index'

export async function reserveStock(productId: string, quantity: number): Promise<number> {
  const redis = getRedis()
  const key = `stock:${productId}`
  const remaining = await redis.decrby(key, quantity)
  if (remaining < 0) {
    await redis.incrby(key, quantity)
    throw new Error('OUT_OF_STOCK')
  }
  return remaining
}

export async function confirmStockReservation(
  _productId: string,
  _quantity: number,
): Promise<void> {
  // TODO(@platform, 2026-04-23): Persist reservation confirmation in the DB (idempotent).
}

export async function restoreStock(productId: string, quantity: number): Promise<void> {
  const redis = getRedis()
  const key = `stock:${productId}`
  await redis.incrby(key, quantity)
}

export async function getStock(productId: string): Promise<number> {
  const redis = getRedis()
  const key = `stock:${productId}`
  const stock = await redis.get(key)
  return stock ? parseInt(stock, 10) : 0
}
