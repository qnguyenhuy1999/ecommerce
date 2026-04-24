import type { ProductVariantEntity } from '../entities/product-variant.entity'

export const PRODUCT_VARIANT_REPOSITORY = Symbol('PRODUCT_VARIANT_REPOSITORY')

export interface IProductVariantRepository {
  findById(id: string): Promise<ProductVariantEntity | null>
}
