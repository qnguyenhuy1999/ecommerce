import { Type } from 'class-transformer'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import {
  IsBoolean,
  IsIn,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  Max,
  Min,
} from 'class-validator'

const SHOP_PRODUCT_SORTS = ['popular', 'newest', 'price-asc', 'price-desc'] as const

export class ShopLocationDto {
  @ApiPropertyOptional({ nullable: true, type: String }) city!: string | null
  @ApiPropertyOptional({ nullable: true, type: String }) state!: string | null
  @ApiPropertyOptional({ nullable: true, type: String }) country!: string | null
}

export class ShopSummaryDto {
  @ApiProperty() id!: string
  @ApiProperty() name!: string
  @ApiProperty() slug!: string
  @ApiPropertyOptional({ nullable: true, type: String }) description!: string | null
  @ApiPropertyOptional({ nullable: true, type: String }) logo!: string | null
  @ApiPropertyOptional({ nullable: true, type: String }) banner!: string | null
  @ApiPropertyOptional({ nullable: true, type: String }) phone!: string | null
  @ApiPropertyOptional({ nullable: true, type: String }) email!: string | null
  @ApiProperty({ type: 'string', format: 'date-time' }) createdAt!: Date
  @ApiProperty({ type: () => ShopLocationDto }) location!: ShopLocationDto
}

export class ShopCardSummaryDto {
  @ApiProperty() id!: string
  @ApiProperty() name!: string
  @ApiProperty() slug!: string
  @ApiPropertyOptional({ nullable: true, type: String }) logo!: string | null
}

export class ShopStatsDto {
  @ApiProperty() productCount!: number
  @ApiProperty() reviewCount!: number
  @ApiProperty() averageRating!: number
  @ApiProperty() responseRate!: number
  @ApiProperty() soldCount!: number
}

export class ShopSocialDto {
  @ApiPropertyOptional({ nullable: true, type: Number }) followersCount!: number | null
}

export class ShopHighlightsDto {
  @ApiProperty() joinedYear!: number
  @ApiPropertyOptional({ nullable: true, type: String }) shipsFrom!: string | null
  @ApiProperty() officialShop!: boolean
}

export class ShopVoucherDto {
  @ApiProperty() id!: string
  @ApiProperty() code!: string
  @ApiProperty() name!: string
  @ApiPropertyOptional({ nullable: true, type: String }) description!: string | null
  @ApiProperty({ description: 'PERCENTAGE | FIXED_AMOUNT' }) type!: string
  @ApiProperty() discountValue!: number
  @ApiPropertyOptional({ nullable: true, type: Number }) maxDiscountAmount!: number | null
  @ApiPropertyOptional({ nullable: true, type: Number }) minOrderAmount!: number | null
  @ApiProperty({ type: 'string', format: 'date-time' }) expiresAt!: Date
}

export class ShopCategorySummaryDto {
  @ApiProperty() id!: string
  @ApiProperty() name!: string
  @ApiProperty() slug!: string
}

export class ShopProductCardDto {
  @ApiProperty() id!: string
  @ApiProperty() name!: string
  @ApiProperty() slug!: string
  @ApiPropertyOptional({ nullable: true, type: String }) description!: string | null
  @ApiProperty() price!: number
  @ApiPropertyOptional({ nullable: true, type: String }) imageUrl!: string | null
  @ApiProperty() averageRating!: number
  @ApiProperty() reviewCount!: number
  @ApiProperty() soldCount!: number
  @ApiProperty({ type: 'string', format: 'date-time' }) createdAt!: Date
  @ApiProperty({ type: () => ShopCardSummaryDto }) shop!: ShopCardSummaryDto
  @ApiPropertyOptional({ nullable: true, type: () => ShopCategorySummaryDto })
  category!: ShopCategorySummaryDto | null
}

export class ShopTabCountsDto {
  @ApiProperty() home!: boolean
  @ApiProperty() products!: number
  @ApiProperty() vouchers!: number
  @ApiProperty() reviews!: number
}

export class OffsetMetaDto {
  @ApiProperty() total!: number
  @ApiProperty() page!: number
  @ApiProperty() limit!: number
  @ApiProperty() totalPages!: number
  @ApiProperty() hasNextPage!: boolean
  @ApiProperty() hasPreviousPage!: boolean
}

export class ShopProductsOffsetDto {
  @ApiProperty({ type: () => [ShopProductCardDto] }) items!: ShopProductCardDto[]
  @ApiProperty({ type: () => OffsetMetaDto }) meta!: OffsetMetaDto
}

export class ShopPriceRangeFilterDto {
  @ApiPropertyOptional({ nullable: true, type: Number }) min!: number | null
  @ApiPropertyOptional({ nullable: true, type: Number }) max!: number | null
  @ApiPropertyOptional({ nullable: true, type: Number }) selectedMin!: number | null
  @ApiPropertyOptional({ nullable: true, type: Number }) selectedMax!: number | null
}

export class ShopRatingBucketDto {
  @ApiProperty() rating!: number
  @ApiProperty() count!: number
  @ApiProperty() isSelected!: boolean
}

export class ShopProductFiltersDto {
  @ApiProperty({ type: () => ShopPriceRangeFilterDto }) priceRange!: ShopPriceRangeFilterDto
  @ApiProperty({ type: () => [ShopRatingBucketDto] }) ratingBuckets!: ShopRatingBucketDto[]
}

export class ShopSortDto {
  @ApiProperty({ enum: [...SHOP_PRODUCT_SORTS] }) current!: (typeof SHOP_PRODUCT_SORTS)[number]
  @ApiProperty({ type: [String], enum: [...SHOP_PRODUCT_SORTS] })
  options!: readonly (typeof SHOP_PRODUCT_SORTS)[number][]
}

export class ShopDetailResponseDto {
  @ApiProperty({ type: () => ShopSummaryDto }) shop!: ShopSummaryDto
  @ApiProperty({ type: () => ShopStatsDto }) stats!: ShopStatsDto
  @ApiProperty({ type: () => ShopSocialDto }) social!: ShopSocialDto
  @ApiProperty({ type: () => ShopHighlightsDto }) highlights!: ShopHighlightsDto
  @ApiProperty({ type: () => [ShopVoucherDto] }) vouchersPreview!: ShopVoucherDto[]
  @ApiProperty({ type: () => [ShopProductCardDto] }) featuredProducts!: ShopProductCardDto[]
  @ApiProperty({ type: () => [ShopProductCardDto] }) bestSellers!: ShopProductCardDto[]
  @ApiProperty({ type: () => ShopTabCountsDto }) tabs!: ShopTabCountsDto
  @ApiProperty({ type: () => ShopProductsOffsetDto }) productsPreview!: ShopProductsOffsetDto
}

export class ShopProductsQueryDto {
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
    enum: [...SHOP_PRODUCT_SORTS],
    default: 'popular',
  })
  @IsOptional()
  @IsIn(SHOP_PRODUCT_SORTS)
  sort?: (typeof SHOP_PRODUCT_SORTS)[number] = 'popular'

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
  @Matches(/^\s*[1-5](\s*,\s*[1-5])*\s*$/, {
    message: 'ratings must be comma-separated 1-5 values',
  })
  ratings?: string
}

export class ShopProductsResponseDto {
  @ApiProperty({ type: () => ShopCardSummaryDto }) shop!: ShopCardSummaryDto
  @ApiProperty({ type: () => ShopProductsOffsetDto }) products!: ShopProductsOffsetDto
  @ApiProperty({ type: () => ShopProductFiltersDto }) filters!: ShopProductFiltersDto
  @ApiProperty({ type: () => ShopSortDto }) sort!: ShopSortDto
}

export class ShopReviewsQueryDto {
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

  @ApiPropertyOptional({ description: 'Filter by exact rating', minimum: 1, maximum: 5 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(5)
  rating?: number

  @ApiPropertyOptional({ description: 'Only reviews with images', default: false })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  withMedia?: boolean = false
}

export class ReviewBuyerDto {
  @ApiProperty() displayName!: string
}

export class ReviewProductDto {
  @ApiProperty() id!: string
  @ApiProperty() name!: string
  @ApiProperty() slug!: string
}

export class ReviewImageDto {
  @ApiProperty() id!: string
  @ApiProperty() url!: string
  @ApiProperty() sortOrder!: number
}

export class ReviewReplyDto {
  @ApiProperty() id!: string
  @ApiProperty() message!: string
  @ApiProperty({ type: 'string', format: 'date-time' }) createdAt!: Date
}

export class ShopReviewDto {
  @ApiProperty() id!: string
  @ApiProperty() rating!: number
  @ApiPropertyOptional({ nullable: true, type: String }) title!: string | null
  @ApiPropertyOptional({ nullable: true, type: String }) comment!: string | null
  @ApiProperty({ type: 'string', format: 'date-time' }) createdAt!: Date
  @ApiProperty({ type: () => ReviewBuyerDto }) buyer!: ReviewBuyerDto
  @ApiProperty({ type: () => ReviewProductDto }) product!: ReviewProductDto
  @ApiProperty({ type: () => [ReviewImageDto] }) images!: ReviewImageDto[]
  @ApiPropertyOptional({ nullable: true, type: () => ReviewReplyDto }) reply!: ReviewReplyDto | null
}

export class ShopReviewsOffsetDto {
  @ApiProperty({ type: () => [ShopReviewDto] }) items!: ShopReviewDto[]
  @ApiProperty({ type: () => OffsetMetaDto }) meta!: OffsetMetaDto
}

export class ShopRatingBreakdownDto {
  @ApiProperty() rating!: number
  @ApiProperty() count!: number
}

export class ShopReviewSummaryDto {
  @ApiProperty() averageRating!: number
  @ApiProperty() reviewCount!: number
  @ApiProperty({ type: () => [ShopRatingBreakdownDto] }) ratingBreakdown!: ShopRatingBreakdownDto[]
}

export class ShopReviewsResponseDto {
  @ApiProperty({ type: () => ShopCardSummaryDto }) shop!: ShopCardSummaryDto
  @ApiProperty({ type: () => ShopReviewSummaryDto }) summary!: ShopReviewSummaryDto
  @ApiProperty({ type: () => ShopReviewsOffsetDto }) reviews!: ShopReviewsOffsetDto
}
