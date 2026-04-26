import { Type } from 'class-transformer'
import { IsIn, IsInt, IsOptional, IsString, MaxLength, Min, NotEquals } from 'class-validator'

const RESERVATION_STATUSES = ['ACTIVE', 'EXPIRED', 'CONFIRMED'] as const
type ReservationStatusValue = (typeof RESERVATION_STATUSES)[number]

export class AdjustStockDto {
  /**
   * Signed delta to apply to the variant's stock. Positive values restock;
   * negative values shrink stock (e.g. damaged-goods write-offs). Zero is
   * rejected so adjustments always carry intent.
   */
  @IsInt()
  @NotEquals(0)
  delta!: number

  @IsOptional()
  @IsString()
  @MaxLength(500)
  reason?: string
}

export class ListLowStockQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  threshold?: number

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number
}

export class ListReservationsQueryDto {
  @IsOptional()
  @IsString()
  variantId?: string

  @IsOptional()
  @IsString()
  orderId?: string

  @IsOptional()
  @IsIn(RESERVATION_STATUSES)
  status?: ReservationStatusValue

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number
}
