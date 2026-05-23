import { Type } from 'class-transformer'
import {
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Matches,
  Max,
  Min,
  IsNumber,
} from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

const CATEGORY_PAGE_SORTS = ['popular', 'newest', 'price-asc', 'price-desc'] as const

export class CategoryPageQueryDto {
  @ApiPropertyOptional({ description: '1-based page index', default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1

  @ApiPropertyOptional({ description: 'Page size', default: 20, maximum: 100 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 20

  @ApiPropertyOptional({
    description: 'Sort option',
    enum: [...CATEGORY_PAGE_SORTS],
    default: 'popular',
  })
  @IsOptional()
  @IsIn(CATEGORY_PAGE_SORTS)
  sort?: (typeof CATEGORY_PAGE_SORTS)[number] = 'popular'

  @ApiPropertyOptional({ description: 'Comma-separated descendant category ids' })
  @IsOptional()
  @IsString()
  categoryIds?: string

  @ApiPropertyOptional({ description: 'Minimum price filter' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  minPrice?: number

  @ApiPropertyOptional({ description: 'Maximum price filter' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  maxPrice?: number

  @ApiPropertyOptional({
    description: 'Comma-separated rating bucket selections such as 5,4,3',
    example: '4,5',
  })
  @IsOptional()
  @IsString()
  @Matches(/^\s*[1-5](\s*,\s*[1-5])*\s*$/, { message: 'ratings must be comma-separated 1-5 values' })
  ratings?: string
}

export class CategoryBreadcrumbDto {
  @ApiProperty() id!: string
  @ApiProperty() name!: string
  @ApiProperty() slug!: string
}

export class CategoryListItemDto {
  @ApiProperty() id!: string
  @ApiProperty() name!: string
  @ApiProperty() slug!: string
  @ApiProperty({ nullable: true, type: String }) icon!: string | null
  @ApiProperty({ nullable: true, type: String }) banner!: string | null
  @ApiProperty({ nullable: true, type: String }) description!: string | null
  @ApiProperty() sortOrder!: number
  @ApiProperty({ type: () => [CategoryListItemDto] }) children!: CategoryListItemDto[]
}

export class CategorySummaryDto extends CategoryBreadcrumbDto {
  @ApiPropertyOptional() parentId!: string | null
  @ApiPropertyOptional() description!: string | null
  @ApiPropertyOptional() banner!: string | null
  @ApiPropertyOptional() metaTitle!: string | null
  @ApiPropertyOptional() metaDesc!: string | null
}

export class CategoryFilterOptionDto extends CategoryBreadcrumbDto {
  @ApiProperty() productCount!: number
  @ApiProperty() isSelected!: boolean
}

export class PriceRangeFilterDto {
  @ApiProperty() min!: number | null
  @ApiProperty() max!: number | null
  @ApiProperty() selectedMin!: number | null
  @ApiProperty() selectedMax!: number | null
}

export class RatingBucketFilterDto {
  @ApiProperty() rating!: number
  @ApiProperty() count!: number
  @ApiProperty() isSelected!: boolean
}

export class ProductCardDto {
  @ApiProperty() id!: string
  @ApiProperty() name!: string
  @ApiProperty() slug!: string
  @ApiPropertyOptional() description!: string | null
  @ApiProperty() price!: number
  @ApiPropertyOptional() imageUrl!: string | null
  @ApiProperty() averageRating!: number
  @ApiProperty() reviewCount!: number
  @ApiProperty() soldCount!: number
  @ApiProperty({ type: 'string', format: 'date-time' }) createdAt!: Date
  @ApiProperty({ type: () => CategoryBreadcrumbDto }) category!: CategoryBreadcrumbDto
  @ApiProperty({
    type: 'object',
    properties: {
      id: { type: 'string' },
      name: { type: 'string' },
      slug: { type: 'string' },
    },
  })
  shop!: {
    id: string
    name: string
    slug: string
  }
}

export class CategoryProductsDto {
  @ApiProperty({ type: () => [ProductCardDto] })
  items!: ProductCardDto[]

  @ApiProperty({
    type: 'object',
    properties: {
      total: { type: 'number' },
      page: { type: 'number' },
      limit: { type: 'number' },
      totalPages: { type: 'number' },
      hasNextPage: { type: 'boolean' },
      hasPreviousPage: { type: 'boolean' },
    },
  })
  meta!: {
    total: number
    page: number
    limit: number
    totalPages: number
    hasNextPage: boolean
    hasPreviousPage: boolean
  }
}

export class CategoryPageFiltersDto {
  @ApiProperty({ type: () => [CategoryFilterOptionDto] })
  categories!: CategoryFilterOptionDto[]

  @ApiProperty({ type: () => PriceRangeFilterDto })
  priceRange!: PriceRangeFilterDto

  @ApiProperty({ type: () => [RatingBucketFilterDto] })
  ratingBuckets!: RatingBucketFilterDto[]
}

export class CategoryPageResponseDto {
  @ApiProperty({ type: () => CategorySummaryDto })
  category!: CategorySummaryDto

  @ApiProperty({ type: () => [CategoryBreadcrumbDto] })
  breadcrumb!: CategoryBreadcrumbDto[]

  @ApiProperty({ type: () => [CategoryFilterOptionDto] })
  subcategories!: CategoryFilterOptionDto[]

  @ApiProperty({ type: () => CategoryPageFiltersDto })
  filters!: CategoryPageFiltersDto

  @ApiProperty({ type: () => CategoryProductsDto })
  products!: CategoryProductsDto

  @ApiProperty({
    type: 'object',
    properties: {
      current: { type: 'string', enum: [...CATEGORY_PAGE_SORTS] },
      options: {
        type: 'array',
        items: { type: 'string', enum: [...CATEGORY_PAGE_SORTS] },
      },
    },
  })
  sort!: {
    current: (typeof CATEGORY_PAGE_SORTS)[number]
    options: readonly (typeof CATEGORY_PAGE_SORTS)[number][]
  }
}
