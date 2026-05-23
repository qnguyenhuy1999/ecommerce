import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import {
  IsEnum,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  ValidateNested,
} from 'class-validator'

// ─── Request DTOs ─────────────────────────────────────────────────

export class SetCheckoutAddressDto {
  @ApiProperty()
  @IsUUID()
  addressId!: string
}

export class ShippingSelectionItemDto {
  @ApiProperty()
  @IsUUID()
  shopId!: string

  @ApiProperty()
  @IsUUID()
  providerId!: string
}

export class SetCheckoutShippingDto {
  @ApiProperty({ type: [ShippingSelectionItemDto] })
  @ValidateNested({ each: true })
  @Type(() => ShippingSelectionItemDto)
  selections!: ShippingSelectionItemDto[]
}

export class PaymentMethodDto {
  @ApiProperty({ enum: ['COD', 'CARD', 'WALLET'] })
  @IsEnum(['COD', 'CARD', 'WALLET'])
  method!: 'COD' | 'CARD' | 'WALLET'

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  details?: Record<string, unknown>
}

export class SetCheckoutPaymentDto {
  @ApiProperty()
  @ValidateNested()
  @Type(() => PaymentMethodDto)
  paymentMethod!: PaymentMethodDto
}

export class ConfirmCheckoutDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(128)
  idempotencyKey?: string
}

// ─── Response DTOs ────────────────────────────────────────────────

export class DistributionLogDto {
  @ApiProperty() id!: string
  @ApiProperty() event!: string
  @ApiProperty() status!: string
  @ApiPropertyOptional({ nullable: true }) errorMessage!: string | null
  @ApiProperty() createdAt!: Date
}

export class CheckoutSessionDto {
  @ApiProperty() id!: string
  @ApiProperty() idempotencyKey!: string
  @ApiProperty() step!: string
  @ApiPropertyOptional({ nullable: true, type: String }) addressId!: string | null
  @ApiPropertyOptional({ nullable: true }) shippingSelections!: unknown
  @ApiPropertyOptional({ nullable: true }) paymentMethod!: unknown
  @ApiPropertyOptional({ nullable: true, type: String }) couponCode!: string | null
  @ApiProperty() subtotal!: number
  @ApiProperty() shippingFee!: number
  @ApiProperty() discount!: number
  @ApiProperty() total!: number
  @ApiPropertyOptional({ nullable: true, type: String }) orderId!: string | null
  @ApiProperty() expiresAt!: Date
  @ApiProperty() createdAt!: Date
  @ApiProperty({ type: [DistributionLogDto] }) distributionLogs!: DistributionLogDto[]
}

export class ConfirmCheckoutResponseDto {
  @ApiProperty() sessionId!: string
  @ApiPropertyOptional({ nullable: true, type: String }) orderId!: string | null
  @ApiProperty() status!: string
}
