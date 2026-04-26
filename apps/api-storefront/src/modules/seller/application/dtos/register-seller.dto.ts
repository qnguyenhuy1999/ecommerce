import {
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator'

export class RegisterSellerDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(120)
  storeName!: string

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  storeDescription?: string

  @IsString()
  @IsNotEmpty()
  @MaxLength(64)
  businessRegistrationNumber!: string

  @IsString()
  @IsNotEmpty()
  @MaxLength(64)
  bankAccountNumber!: string

  @IsString()
  @IsNotEmpty()
  @MaxLength(32)
  bankCode!: string

  @IsOptional()
  @IsObject()
  kycDocuments?: Record<string, unknown>
}
