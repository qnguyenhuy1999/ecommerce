import type { ProductResponse } from '@ecom/api-types'
import type { Product as StorefrontProduct } from '@ecom/ui-storefront'

const PLACEHOLDER_IMAGE =
  'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=900&fit=crop'

/**
 * Map a backend `ProductResponse` to the shape the storefront product card /
 * grid components expect. Falls back to a placeholder image when the product
 * has not been given any imagery yet.
 */
export function toStorefrontProduct(product: ProductResponse): StorefrontProduct {
  return {
    id: product.id,
    title: product.name,
    image: product.images[0] ?? PLACEHOLDER_IMAGE,
    price: product.price,
    rating: product.rating || undefined,
    ratingCount: product.reviewCount || undefined,
  }
}
