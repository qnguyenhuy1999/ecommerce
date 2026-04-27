import { Type } from 'class-transformer'
import { IsIn, IsInt, IsNumber, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator'

export const PRODUCT_SORT_FIELDS = ['createdAt', 'updatedAt', 'price', 'name', 'rating'] as const
export type ProductSortField = (typeof PRODUCT_SORT_FIELDS)[number]

export const PRODUCT_SORT_ORDERS = ['asc', 'desc'] as const
export type ProductSortOrder = (typeof PRODUCT_SORT_ORDERS)[number]

export class ListProductsDto {
  @IsOptional()
  @IsString()
  @MaxLength(200)
  q?: string

  @IsOptional()
  @IsString()
  category?: string

  @IsOptional()
  @IsString()
  categoryId?: string

  @IsOptional()
  @IsString()
  @MaxLength(120)
  sku?: string

  @IsOptional()
  @IsString()
  @MaxLength(120)
  storeName?: string

  @IsOptional()
  @IsString()
  sellerId?: string

  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  minPrice?: number

  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  maxPrice?: number

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit: number = 20

  @IsOptional()
  @IsIn(PRODUCT_SORT_FIELDS)
  sort: ProductSortField = 'createdAt'

  @IsOptional()
  @IsIn(PRODUCT_SORT_ORDERS)
  order: ProductSortOrder = 'desc'
}
