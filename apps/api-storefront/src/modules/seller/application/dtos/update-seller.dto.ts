import {
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator'

export class UpdateSellerDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(120)
  storeName?: string

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  storeDescription?: string

  @IsOptional()
  @IsString()
  @MaxLength(64)
  businessRegistrationNumber?: string

  @IsOptional()
  @IsString()
  @MaxLength(64)
  bankAccountNumber?: string

  @IsOptional()
  @IsString()
  @MaxLength(32)
  bankCode?: string

  @IsOptional()
  @IsObject()
  kycDocuments?: Record<string, unknown>
}
