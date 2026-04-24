import type { CartItemEntity } from '../entities/cart-item.entity'
import type { CartEntity } from '../entities/cart.entity'

export const CART_REPOSITORY = Symbol('CART_REPOSITORY')

export interface ICartRepository {
  findByUserIdWithItems(userId: string): Promise<CartEntity | null>
  createForUser(userId: string): Promise<CartEntity>
  findItemByCartAndVariant(cartId: string, variantId: string): Promise<CartItemEntity | null>
  findItemById(cartItemId: string): Promise<CartItemEntity | null>
  addItem(cartId: string, variantId: string, quantity: number): Promise<CartItemEntity>
  updateItemQuantity(itemId: string, quantity: number): Promise<CartItemEntity>
  deleteItem(itemId: string): Promise<void>
  deleteAllItems(cartId: string): Promise<void>
  findCartById(cartId: string): Promise<CartEntity | null>
}
