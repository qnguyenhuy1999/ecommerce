export type ProductStatus = 'DRAFT' | 'ACTIVE' | 'INACTIVE' | 'ARCHIVED'

export interface ProductSellerSnapshot {
  id: string
  storeName: string
}

export interface ProductSnapshot {
  id: string
  name: string
  price: number
  status: ProductStatus
  seller: ProductSellerSnapshot
}

export interface ProductVariantProps {
  id: string
  sku: string
  attributes: unknown
  priceOverride: number | null
  stock: number
  reservedStock: number
  product: ProductSnapshot
}

export class ProductVariantEntity {
  constructor(readonly props: ProductVariantProps) {}

  get id(): string {
    return this.props.id
  }

  get availableStock(): number {
    return Math.max(0, this.props.stock - this.props.reservedStock)
  }

  get effectivePrice(): number {
    return this.props.priceOverride ?? this.props.product.price
  }

  isProductActive(): boolean {
    return this.props.product.status === 'ACTIVE'
  }

  canFulfillQuantity(quantity: number): boolean {
    return quantity <= this.availableStock
  }
}
