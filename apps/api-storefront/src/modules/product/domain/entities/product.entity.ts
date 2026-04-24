export type ProductStatus = 'DRAFT' | 'ACTIVE' | 'INACTIVE' | 'DELETED'

export interface ProductSellerSnapshot {
  id: string
  storeName: string
  rating: number
  userId?: string
}

export interface ProductVariantSnapshot {
  id: string
  sku: string
  attributes: Record<string, unknown>
  priceOverride: number | null
  stock: number
  reservedStock: number
  createdAt?: Date
  updatedAt?: Date
}

export interface ProductProps {
  id: string
  sellerId: string
  sku: string
  name: string
  description: string | null
  price: number
  status: ProductStatus
  categoryId: string | null
  images: string[]
  rating: number
  reviewCount: number
  createdAt: Date
  updatedAt: Date
  deletedAt: Date | null
  seller?: ProductSellerSnapshot
  variants?: ProductVariantSnapshot[]
  variantCount?: number
}

export class ProductEntity {
  constructor(readonly props: ProductProps) {}

  get id(): string {
    return this.props.id
  }

  get sellerId(): string {
    return this.props.sellerId
  }

  get status(): ProductStatus {
    return this.props.status
  }

  get deletedAt(): Date | null {
    return this.props.deletedAt
  }

  get seller(): ProductSellerSnapshot | undefined {
    return this.props.seller
  }

  get variants(): ProductVariantSnapshot[] | undefined {
    return this.props.variants
  }

  get variantCount(): number | undefined {
    return this.props.variantCount
  }

  isDeleted(): boolean {
    return this.props.status === 'DELETED' || this.props.deletedAt !== null
  }

  isActive(): boolean {
    return this.props.status === 'ACTIVE' && !this.isDeleted()
  }

  isOwnedBy(userId: string): boolean {
    return this.props.seller?.userId === userId
  }
}
