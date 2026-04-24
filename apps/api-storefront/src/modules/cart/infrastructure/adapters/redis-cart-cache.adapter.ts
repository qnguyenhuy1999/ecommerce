import { Injectable, Logger } from '@nestjs/common'

import { deleteCartRedis, getCartRedis, setCartRedis } from '@ecom/redis'

import type { CartView } from '../../application/views/cart.view'
import {
  CART_CACHE_TTL_SECONDS,
  type ICartCache,
} from '../../domain/ports/cart-cache.port'

function cartCacheKey(userId: string): string {
  return `cart:${userId}`
}

function isCartView(value: unknown): value is CartView {
  if (value === null || typeof value !== 'object') return false
  const v = value as Partial<CartView>
  return (
    typeof v.id === 'string' &&
    typeof v.subtotal === 'number' &&
    typeof v.itemCount === 'number' &&
    Array.isArray(v.items) &&
    Array.isArray(v.sellerGroups)
  )
}

@Injectable()
export class RedisCartCacheAdapter implements ICartCache {
  private readonly logger = new Logger(RedisCartCacheAdapter.name)

  async get(userId: string): Promise<CartView | null> {
    const key = cartCacheKey(userId)
    const raw = await getCartRedis(key)
    if (raw === null) return null
    if (!isCartView(raw)) {
      this.logger.warn(`Discarding malformed cart cache entry for key=${key}`)
      await deleteCartRedis(key)
      return null
    }
    return raw
  }

  async set(userId: string, view: CartView, ttlSeconds = CART_CACHE_TTL_SECONDS): Promise<void> {
    await setCartRedis(cartCacheKey(userId), view, ttlSeconds)
  }

  async delete(userId: string): Promise<void> {
    await deleteCartRedis(cartCacheKey(userId))
  }
}
