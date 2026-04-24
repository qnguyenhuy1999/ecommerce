import type { CartView } from '../../application/views/cart.view'

export const CART_CACHE = Symbol('CART_CACHE')

export interface ICartCache {
  get(userId: string): Promise<CartView | null>
  set(userId: string, view: CartView, ttlSeconds?: number): Promise<void>
  delete(userId: string): Promise<void>
}
