import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import {
  IsBoolean,
  IsOptional,
  IsString,
  Length,
  MaxLength,
  MinLength,
} from 'class-validator'

export class CreateAddressDto {
  @ApiProperty()
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  recipientName!: string

  @ApiProperty()
  @IsString()
  @MinLength(6)
  @MaxLength(20)
  phone!: string

  @ApiProperty()
  @IsString()
  @MinLength(1)
  @MaxLength(500)
  addressLine!: string

  @ApiProperty()
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  city!: string

  @ApiProperty()
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  province!: string

  @ApiProperty()
  @IsString()
  @MinLength(1)
  @MaxLength(20)
  postalCode!: string

  @ApiPropertyOptional({ default: 'SG' })
  @IsOptional()
  @IsString()
  @Length(2, 2)
  countryCode?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(50)
  label?: string

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  isDefault?: boolean
}

export class UpdateAddressDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  recipientName?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MinLength(6)
  @MaxLength(20)
  phone?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(500)
  addressLine?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  city?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  province?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(20)
  postalCode?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Length(2, 2)
  countryCode?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(50)
  label?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isDefault?: boolean
}

export class AddressDto {
  @ApiProperty() id!: string
  @ApiProperty() recipientName!: string
  @ApiProperty() phone!: string
  @ApiProperty() addressLine!: string
  @ApiProperty() city!: string
  @ApiProperty() province!: string
  @ApiProperty() postalCode!: string
  @ApiProperty() countryCode!: string
  @ApiProperty({ nullable: true, type: String }) label!: string | null
  @ApiProperty() isDefault!: boolean
  @ApiProperty() createdAt!: Date
  @ApiProperty() updatedAt!: Date
}
