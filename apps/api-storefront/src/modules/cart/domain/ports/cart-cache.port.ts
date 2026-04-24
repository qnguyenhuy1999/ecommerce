import type { CartView } from '../../application/views/cart.view'

export const CART_CACHE = Symbol('CART_CACHE')

/**
 * Default TTL for cached cart views. Adapters use this when no explicit
 * TTL is passed to `set()`; handlers therefore never need to duplicate it.
 */
export const CART_CACHE_TTL_SECONDS = 86400

export interface ICartCache {
  get(userId: string): Promise<CartView | null>
  set(userId: string, view: CartView, ttlSeconds?: number): Promise<void>
  delete(userId: string): Promise<void>
}
