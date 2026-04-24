import type { CartItemEntity } from './cart-item.entity'

export interface CartProps {
  id: string
  userId: string
  items: CartItemEntity[]
}

export class CartEntity {
  constructor(readonly props: CartProps) {}

  get id(): string {
    return this.props.id
  }

  get userId(): string {
    return this.props.userId
  }

  get items(): CartItemEntity[] {
    return this.props.items
  }

  isOwnedBy(userId: string): boolean {
    return this.props.userId === userId
  }

  findItemByVariantId(variantId: string): CartItemEntity | undefined {
    return this.props.items.find((item) => item.variantId === variantId)
  }

  /**
   * Replace an existing item (matched by id) in-place, or append if missing.
   * Lets handlers avoid an extra DB read after a mutation when the repository
   * already returns a hydrated item.
   */
  upsertItem(item: CartItemEntity): void {
    const idx = this.props.items.findIndex((existing) => existing.id === item.id)
    if (idx === -1) {
      this.props.items.push(item)
    } else {
      this.props.items.splice(idx, 1, item)
    }
  }

  subtotal(): number {
    return this.props.items.reduce((sum, item) => sum + item.lineSubtotal(), 0)
  }

  itemCount(): number {
    return this.props.items.reduce((sum, item) => sum + item.quantity, 0)
  }
}
