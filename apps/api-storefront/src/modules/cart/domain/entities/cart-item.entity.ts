import type { ProductVariantEntity } from './product-variant.entity'

export interface CartItemProps {
  id: string
  cartId: string
  variantId: string
  quantity: number
  variant?: ProductVariantEntity
}

export class CartItemEntity {
  constructor(readonly props: CartItemProps) {}

  get id(): string {
    return this.props.id
  }

  get cartId(): string {
    return this.props.cartId
  }

  get variantId(): string {
    return this.props.variantId
  }

  get quantity(): number {
    return this.props.quantity
  }

  get variant(): ProductVariantEntity | undefined {
    return this.props.variant
  }

  lineSubtotal(): number {
    const variant = this.props.variant
    if (!variant) return 0
    return variant.effectivePrice * this.props.quantity
  }
}
