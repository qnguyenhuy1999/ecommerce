import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class ProductDetailBreadcrumbDto {
  @ApiProperty() id!: string
  @ApiProperty() name!: string
  @ApiProperty() slug!: string
}

export class ProductDetailMediaDto {
  @ApiProperty() id!: string
  @ApiProperty() url!: string
  @ApiPropertyOptional({ nullable: true, type: String }) alt!: string | null
  @ApiProperty() isCover!: boolean
}

export class ProductDetailVariantOptionValueDto {
  @ApiProperty() groupId!: string
  @ApiProperty() groupName!: string
  @ApiProperty() optionId!: string
  @ApiProperty() optionValue!: string
}

export class ProductDetailVariantDto {
  @ApiProperty() id!: string
  @ApiPropertyOptional({ nullable: true, type: String }) sku!: string | null
  @ApiProperty() price!: number
  @ApiProperty() stock!: number
  @ApiProperty({ type: [ProductDetailVariantOptionValueDto] })
  optionValues!: ProductDetailVariantOptionValueDto[]
}

export class ProductDetailOptionDto {
  @ApiProperty() id!: string
  @ApiProperty() value!: string
}

export class ProductDetailOptionGroupDto {
  @ApiProperty() id!: string
  @ApiProperty() name!: string
  @ApiProperty({ type: [ProductDetailOptionDto] })
  options!: ProductDetailOptionDto[]
}

export class ProductDetailQuantityDto {
  @ApiProperty() min!: number
  @ApiProperty() max!: number
}

export class ProductDetailPurchaseOptionsDto {
  @ApiPropertyOptional({ nullable: true, type: String }) defaultVariantId!: string | null
  @ApiProperty({ type: ProductDetailQuantityDto }) quantity!: ProductDetailQuantityDto
  @ApiProperty({ type: [ProductDetailOptionGroupDto] }) optionGroups!: ProductDetailOptionGroupDto[]
  @ApiProperty({ type: [ProductDetailVariantDto] }) variants!: ProductDetailVariantDto[]
}

export class ProductDetailProductStatusFlagsDto {
  @ApiProperty() isFlashSale!: boolean
}

export class ProductDetailProductDto {
  @ApiProperty() id!: string
  @ApiProperty() name!: string
  @ApiProperty() slug!: string
  @ApiPropertyOptional({ nullable: true, type: String }) description!: string | null
  @ApiPropertyOptional({ nullable: true, type: String }) shortDescription!: string | null
  @ApiPropertyOptional({ nullable: true, type: String }) sku!: string | null
  @ApiProperty() price!: number
  @ApiPropertyOptional({ nullable: true, type: Number }) originalPrice!: number | null
  @ApiPropertyOptional({ nullable: true, type: Number }) discountPercent!: number | null
  @ApiProperty() currency!: string
  @ApiProperty({ type: ProductDetailProductStatusFlagsDto })
  statusFlags!: ProductDetailProductStatusFlagsDto
}

export class ProductDetailRatingDto {
  @ApiProperty() averageRating!: number
  @ApiProperty() reviewCount!: number
  @ApiProperty() soldCount!: number
}

export class ProductDetailShopDto {
  @ApiProperty() id!: string
  @ApiProperty() name!: string
  @ApiProperty() slug!: string
  @ApiPropertyOptional({ nullable: true, type: String }) logo!: string | null
  @ApiPropertyOptional({ nullable: true, type: String }) shipsFrom!: string | null
  @ApiProperty() followerCount!: number
  @ApiProperty() rating!: number
  @ApiPropertyOptional({ nullable: true, type: Number }) responseRate!: number | null
}

export class ProductDetailShippingReturnsDto {
  @ApiPropertyOptional({ nullable: true, type: String }) shipsFrom!: string | null
  @ApiPropertyOptional({ nullable: true, type: Number }) returnWindowDays!: number | null
  @ApiProperty() authenticityLabel!: string
}

export class ProductDetailRecommendationShopDto {
  @ApiProperty() id!: string
  @ApiProperty() name!: string
  @ApiProperty() slug!: string
  @ApiPropertyOptional({ nullable: true, type: String }) logo!: string | null
}

export class ProductDetailRecommendationDto {
  @ApiProperty() id!: string
  @ApiProperty() name!: string
  @ApiProperty() slug!: string
  @ApiProperty() shopId!: string
  @ApiProperty() price!: number
  @ApiPropertyOptional({ nullable: true, type: String }) coverImage!: string | null
  @ApiPropertyOptional({ nullable: true, type: Number }) rating!: number | null
  @ApiProperty() reviewCount!: number
  @ApiProperty({ type: ProductDetailRecommendationShopDto })
  shop!: ProductDetailRecommendationShopDto
}

export class ProductDetailSpecificationDto {
  @ApiProperty({ additionalProperties: true })
  values!: Record<string, unknown>
}

export class ProductDetailResponseDto {
  @ApiProperty({ type: ProductDetailProductDto }) product!: ProductDetailProductDto
  @ApiProperty({ type: [ProductDetailMediaDto] }) media!: ProductDetailMediaDto[]
  @ApiProperty({ type: [ProductDetailBreadcrumbDto] }) breadcrumbs!: ProductDetailBreadcrumbDto[]
  @ApiProperty({ type: ProductDetailRatingDto }) rating!: ProductDetailRatingDto
  @ApiProperty({ type: ProductDetailPurchaseOptionsDto })
  purchaseOptions!: ProductDetailPurchaseOptionsDto
  @ApiProperty({ type: ProductDetailShopDto }) shop!: ProductDetailShopDto
  @ApiProperty({ type: ProductDetailShippingReturnsDto })
  shippingReturns!: ProductDetailShippingReturnsDto
  @ApiProperty({ type: [ProductDetailSpecificationDto] })
  specifications!: ProductDetailSpecificationDto[]
  @ApiProperty({ type: [ProductDetailRecommendationDto] })
  recommendations!: ProductDetailRecommendationDto[]
}
