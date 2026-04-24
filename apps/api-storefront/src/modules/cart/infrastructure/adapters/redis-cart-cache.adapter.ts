import { Injectable } from '@nestjs/common'

import { deleteCartRedis, getCartRedis, setCartRedis } from '@ecom/redis'

import type { CartView } from '../../application/views/cart.view'
import type { ICartCache } from '../../domain/ports/cart-cache.port'

const CART_CACHE_TTL_SECONDS = 86400

function cartCacheKey(userId: string): string {
  return `cart:${userId}`
}

@Injectable()
export class RedisCartCacheAdapter implements ICartCache {
  async get(userId: string): Promise<CartView | null> {
    const raw = await getCartRedis(cartCacheKey(userId))
    if (!raw) return null
    return raw as unknown as CartView
  }

  async set(userId: string, view: CartView, ttlSeconds = CART_CACHE_TTL_SECONDS): Promise<void> {
    await setCartRedis(cartCacheKey(userId), view, ttlSeconds)
  }

  async delete(userId: string): Promise<void> {
    await deleteCartRedis(cartCacheKey(userId))
  }
}
