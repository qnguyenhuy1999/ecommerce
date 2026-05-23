import { ApiProperty } from '@nestjs/swagger'

export class CategoryDto {
  @ApiProperty() id!: string
  @ApiProperty() name!: string
  @ApiProperty() slug!: string
  @ApiProperty({ nullable: true, type: String }) icon!: string | null
}

export class PlatformVoucherDto {
  @ApiProperty() id!: string
  @ApiProperty() code!: string
  @ApiProperty() name!: string
  @ApiProperty({ description: 'PERCENTAGE | FIXED_AMOUNT' }) type!: string
  @ApiProperty() discountValue!: number
  @ApiProperty({ nullable: true, type: Number }) maxDiscountAmount!: number | null
  @ApiProperty({ nullable: true, type: Number }) minOrderAmount!: number | null
  @ApiProperty() expiresAt!: Date
}

export class ShopSummaryDto {
  @ApiProperty() id!: string
  @ApiProperty() name!: string
  @ApiProperty() slug!: string
  @ApiProperty({ nullable: true, type: String }) logo!: string | null
}

export class ProductCardDto {
  @ApiProperty() id!: string
  @ApiProperty() name!: string
  @ApiProperty() slug!: string
  @ApiProperty() shopId!: string
  @ApiProperty() price!: number
  @ApiProperty({ nullable: true, type: Number }) originalPrice!: number | null
  @ApiProperty({ nullable: true, type: Number }) discountPercent!: number | null
  @ApiProperty({ nullable: true, type: String }) coverImage!: string | null
  @ApiProperty({ nullable: true, type: Number }) rating!: number | null
  @ApiProperty() reviewCount!: number
  @ApiProperty() shop!: ShopSummaryDto
  @ApiProperty() isFlash!: boolean
  @ApiProperty() isNew!: boolean
  @ApiProperty({ nullable: true, type: Number }) stockLeft!: number | null
}

export class FlashSaleProductDto {
  @ApiProperty() id!: string
  @ApiProperty() name!: string
  @ApiProperty() slug!: string
  @ApiProperty() shopId!: string
  @ApiProperty() salePrice!: number
  @ApiProperty() originalPrice!: number
  @ApiProperty() discountPercent!: number
  @ApiProperty() totalStock!: number
  @ApiProperty() soldCount!: number
  @ApiProperty() stockLeft!: number
  @ApiProperty({ nullable: true, type: String }) coverImage!: string | null
  @ApiProperty({ nullable: true, type: Number }) rating!: number | null
  @ApiProperty() reviewCount!: number
  @ApiProperty() shop!: ShopSummaryDto
}

export class FlashSaleDto {
  @ApiProperty() id!: string
  @ApiProperty() name!: string
  @ApiProperty() endsAt!: Date
  @ApiProperty({ type: [FlashSaleProductDto] }) products!: FlashSaleProductDto[]
}

export class FeaturedSectionDto {
  @ApiProperty() title!: string
  @ApiProperty() categorySlug!: string
  @ApiProperty() categoryId!: string
  @ApiProperty({ type: [ProductCardDto] }) products!: ProductCardDto[]
}

export class TrendingShopDto {
  @ApiProperty() id!: string
  @ApiProperty() name!: string
  @ApiProperty() slug!: string
  @ApiProperty({ nullable: true, type: String }) logo!: string | null
  @ApiProperty({ nullable: true, type: String }) banner!: string | null
}

export class HomepageDto {
  @ApiProperty({ type: [CategoryDto] }) categories!: CategoryDto[]
  @ApiProperty({ type: [PlatformVoucherDto] }) vouchers!: PlatformVoucherDto[]
  @ApiProperty({ nullable: true, type: FlashSaleDto }) flashSale!: FlashSaleDto | null
  @ApiProperty({ type: [FeaturedSectionDto] }) featuredSections!: FeaturedSectionDto[]
  @ApiProperty({ type: [TrendingShopDto] }) trendingShops!: TrendingShopDto[]
  @ApiProperty({ type: [ProductCardDto] }) recommendedProducts!: ProductCardDto[]
  @ApiProperty({ type: [ProductCardDto] }) newArrivals!: ProductCardDto[]
}
