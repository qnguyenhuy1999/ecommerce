import { Type } from 'class-transformer'
import {
  ArrayMaxSize,
  IsArray,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator'

export class CreateProductVariantDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  sku!: string

  @IsObject()
  attributes!: Record<string, unknown>

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  priceOverride?: number

  @IsOptional()
  @IsInt()
  @Min(0)
  stock?: number
}

export enum CreateProductStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
}

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  sku!: string

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name!: string

  @IsOptional()
  @IsString()
  @MaxLength(5000)
  description?: string

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  price!: number

  @IsOptional()
  @IsEnum(CreateProductStatus)
  status?: CreateProductStatus

  @IsOptional()
  @IsString()
  categoryId?: string

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(20)
  @IsString({ each: true })
  images?: string[]

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(100)
  @ValidateNested({ each: true })
  @Type(() => CreateProductVariantDto)
  variants?: CreateProductVariantDto[]
}
