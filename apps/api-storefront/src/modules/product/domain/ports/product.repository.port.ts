import type { ProductEntity, ProductStatus, ProductVariantSnapshot } from '../entities/product.entity'

export const PRODUCT_REPOSITORY = Symbol('PRODUCT_REPOSITORY')

export type ProductSortField = 'createdAt' | 'updatedAt' | 'price' | 'name' | 'rating'
export type ProductSortOrder = 'asc' | 'desc'

export interface ProductListFilter {
  q?: string
  categoryId?: string
  sku?: string
  storeName?: string
  sellerId?: string
  minPrice?: number
  maxPrice?: number
  status?: ProductStatus | ProductStatus[]
  excludeStatus?: ProductStatus | ProductStatus[]
  notDeleted?: boolean
}

export interface ProductListOptions extends ProductListFilter {
  page: number
  limit: number
  sort: ProductSortField
  order: ProductSortOrder
}

export interface ProductListResult {
  data: ProductEntity[]
  total: number
}

export interface ProductCreateInput {
  sellerId: string
  sku: string
  name: string
  description?: string
  price: number
  status: ProductStatus
  categoryId?: string
  images: string[]
  variants: Array<{
    sku: string
    attributes: Record<string, unknown>
    priceOverride?: number
    stock?: number
  }>
}

export interface ProductUpdateInput {
  sku?: string
  name?: string
  description?: string
  price?: number
  status?: ProductStatus
  categoryId?: string
  images?: string[]
}

export interface IProductRepository {
  list(options: ProductListOptions): Promise<ProductListResult>
  findByIdWithDetails(
    id: string,
    options: { excludeStatus?: ProductStatus | ProductStatus[] },
  ): Promise<ProductEntity | null>
  findForOwnerCheck(id: string): Promise<ProductEntity | null>
  findBySellerAndSku(sellerId: string, sku: string): Promise<ProductEntity | null>
  listVariants(
    productId: string,
    options: { excludeStatus?: ProductStatus | ProductStatus[] },
  ): Promise<ProductVariantSnapshot[] | null>
  create(input: ProductCreateInput): Promise<ProductEntity>
  update(id: string, input: ProductUpdateInput): Promise<ProductEntity>
  softDelete(id: string): Promise<void>
}
