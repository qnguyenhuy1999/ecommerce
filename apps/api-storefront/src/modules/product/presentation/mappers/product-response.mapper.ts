import type { ProductEntity, ProductVariantSnapshot } from '../../domain/entities/product.entity'

export interface ProductListItemView {
  id: string
  sku: string
  name: string
  description: string | null
  price: number
  status: string
  categoryId: string | null
  images: string[]
  rating: number
  reviewCount: number
  variantCount: number
  seller: { id: string; storeName: string; rating: number }
  createdAt: Date
  updatedAt: Date
}

export interface ProductDetailView {
  id: string
  sku: string
  name: string
  description: string | null
  price: number
  status: string
  categoryId: string | null
  images: string[]
  rating: number
  reviewCount: number
  seller: { id: string; storeName: string; rating: number }
  variants: ProductVariantSnapshot[]
  createdAt: Date
  updatedAt: Date
}

export function toListItemView(entity: ProductEntity): ProductListItemView {
  const props = entity.props
  if (!props.seller) {
    throw new Error('Product list item missing seller projection')
  }
  return {
    id: props.id,
    sku: props.sku,
    name: props.name,
    description: props.description,
    price: props.price,
    status: props.status,
    categoryId: props.categoryId,
    images: props.images,
    rating: props.rating,
    reviewCount: props.reviewCount,
    variantCount: props.variantCount ?? 0,
    seller: {
      id: props.seller.id,
      storeName: props.seller.storeName,
      rating: props.seller.rating,
    },
    createdAt: props.createdAt,
    updatedAt: props.updatedAt,
  }
}

export function toDetailView(entity: ProductEntity): ProductDetailView {
  const props = entity.props
  if (!props.seller) {
    throw new Error('Product detail missing seller projection')
  }
  return {
    id: props.id,
    sku: props.sku,
    name: props.name,
    description: props.description,
    price: props.price,
    status: props.status,
    categoryId: props.categoryId,
    images: props.images,
    rating: props.rating,
    reviewCount: props.reviewCount,
    seller: {
      id: props.seller.id,
      storeName: props.seller.storeName,
      rating: props.seller.rating,
    },
    variants: props.variants ?? [],
    createdAt: props.createdAt,
    updatedAt: props.updatedAt,
  }
}
