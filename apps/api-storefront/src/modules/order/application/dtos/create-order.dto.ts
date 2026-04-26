import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import {
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  Length,
  MaxLength,
  ValidateNested,
} from 'class-validator'

export class ShippingAddressDto {
  @ApiProperty({ example: 'John Doe' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  fullName!: string

  @ApiProperty({ example: '+6591234567' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  phone!: string

  @ApiProperty({ example: '123 Main Street' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  addressLine1!: string

  @ApiPropertyOptional({ example: '#05-123' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  addressLine2?: string

  @ApiProperty({ example: 'Singapore' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  city!: string

  @ApiProperty({ example: '123456' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  postalCode!: string

  @ApiProperty({ example: 'SG' })
  @IsString()
  @Length(2, 2)
  country!: string
}

export class CreateOrderDto {
  @ApiProperty({ type: ShippingAddressDto })
  @ValidateNested()
  @Type(() => ShippingAddressDto)
  shippingAddress!: ShippingAddressDto

  @ApiPropertyOptional({ example: 'stripe' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  paymentMethod?: string

  @ApiPropertyOptional({
    description: 'Client generated key for future duplicate-order protection',
  })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  idempotencyKey?: string

  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>
}
