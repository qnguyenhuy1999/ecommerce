import { Type } from 'class-transformer'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsInt, IsOptional, IsString, IsUUID, MaxLength, Min } from 'class-validator'
import { PlatformVoucherType } from '@ecom/database'

export class AddCartItemDto {
  @ApiProperty()
  @IsUUID()
  productId!: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  variantId?: string

  @ApiProperty({ minimum: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  quantity!: number
}

export class UpdateCartItemDto {
  @ApiProperty({ minimum: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  quantity!: number
}

export class ApplyCartVoucherDto {
  @ApiProperty()
  @IsString()
  @MaxLength(64)
  code!: string
}

export class CartCountDto {
  @ApiProperty() count!: number
}

export class CartShopDto {
  @ApiProperty() id!: string
  @ApiProperty() name!: string
  @ApiProperty() slug!: string
  @ApiProperty({ nullable: true, type: String }) logo!: string | null
}

export class CartVariantDto {
  @ApiProperty() id!: string
  @ApiProperty({ nullable: true, type: String }) sku!: string | null
  @ApiProperty() label!: string
}

export class CartItemDto {
  @ApiProperty() id!: string
  @ApiProperty() productId!: string
  @ApiProperty() productName!: string
  @ApiProperty() productSlug!: string
  @ApiProperty({ nullable: true, type: String }) coverImage!: string | null
  @ApiProperty() quantity!: number
  @ApiProperty() unitPrice!: number
  @ApiProperty() lineTotal!: number
  @ApiProperty() availableStock!: number
  @ApiProperty() shop!: CartShopDto
  @ApiProperty({ nullable: true, type: CartVariantDto }) variant!: CartVariantDto | null
}

export class AppliedCartVoucherDto {
  @ApiProperty() id!: string
  @ApiProperty() code!: string
  @ApiProperty() name!: string
  @ApiProperty({ enum: PlatformVoucherType }) type!: PlatformVoucherType
  @ApiProperty() discountValue!: number
  @ApiProperty({ nullable: true, type: Number }) maxDiscountAmount!: number | null
  @ApiProperty({ nullable: true, type: Number }) minOrderAmount!: number | null
  @ApiProperty() discountTotal!: number
  @ApiProperty() expiresAt!: Date
}

export class CartDto {
  @ApiProperty() id!: string
  @ApiProperty({ type: [CartItemDto] }) items!: CartItemDto[]
  @ApiProperty() totalItems!: number
  @ApiProperty() subtotal!: number
  @ApiProperty() shippingTotal!: number
  @ApiProperty() discountTotal!: number
  @ApiProperty() total!: number
  @ApiProperty({ nullable: true, type: AppliedCartVoucherDto }) voucher!: AppliedCartVoucherDto | null
}
