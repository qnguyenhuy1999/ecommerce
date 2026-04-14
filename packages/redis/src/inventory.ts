import { getRedis } from './index'

// TODO: implement
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

// TODO: implement
export async function confirmStockReservation(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _productId: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _quantity: number,
): Promise<void> {
  // Stock already reserved, mark as confirmed in DB
}

// TODO: implement
export async function restoreStock(productId: string, quantity: number): Promise<void> {
  const redis = getRedis()
  const key = `stock:${productId}`
  await redis.incrby(key, quantity)
}

// TODO: implement
export async function getStock(productId: string): Promise<number> {
  const redis = getRedis()
  const key = `stock:${productId}`
  const stock = await redis.get(key)
  return stock ? parseInt(stock, 10) : 0
}
