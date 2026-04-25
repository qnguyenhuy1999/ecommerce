import type { CartItemEntity } from '../entities/cart-item.entity'
import type { CartEntity } from '../entities/cart.entity'

export const CART_REPOSITORY = Symbol('CART_REPOSITORY')

export interface IncrementItemInput {
  cartId: string
  variantId: string
  incrementBy: number
  /**
   * Upper bound on the resulting quantity. If the atomic upsert would push the
   * item past this cap, the repository aborts the transaction and throws
   * `InsufficientStockException` so concurrent adds never over-commit.
   */
  maxQuantity: number
}

export interface CartItemWithCart {
  item: CartItemEntity
  /** The cart that owns the item. Only the identifying fields are guaranteed to be populated. */
  cart: CartEntity
}

export interface ICartRepository {
  findByUserIdWithItems(userId: string): Promise<CartEntity | null>
  /**
   * Atomically returns the caller's cart, creating it on the first call.
   * Serialises concurrent first-visit requests through the `userId` unique
   * constraint instead of racing two `INSERT`s.
   */
  upsertForUser(userId: string): Promise<CartEntity>
  findItemByCartAndVariant(cartId: string, variantId: string): Promise<CartItemEntity | null>
  /**
   * Fetch a cart item along with a lightweight view of its owning cart so
   * handlers can perform ownership and stock checks in a single round-trip.
   */
  findItemWithCart(cartItemId: string): Promise<CartItemWithCart | null>
  /**
   * Atomically create-or-increment a cart item, capped at `maxQuantity`.
   * Throws `InsufficientStockException` when the cap would be exceeded.
   */
  incrementItemQuantity(input: IncrementItemInput): Promise<CartItemEntity>
  updateItemQuantity(itemId: string, quantity: number): Promise<CartItemEntity>
  deleteItem(itemId: string): Promise<void>
  deleteAllItems(cartId: string): Promise<void>
}
