import { Type } from 'class-transformer'
import { IsIn, IsInt, IsISO8601, IsOptional, IsString, Max, Min, MinLength } from 'class-validator'

import { ORDER_HISTORY_STATUSES, type OrderHistoryStatusFilter } from './list-user-orders.dto'

export class ListAdminOrdersDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit: number = 20

  @IsOptional()
  @IsIn(ORDER_HISTORY_STATUSES)
  status?: OrderHistoryStatusFilter

  @IsOptional()
  @IsString()
  @MinLength(1)
  sellerId?: string

  @IsOptional()
  @IsString()
  @MinLength(1)
  buyerEmail?: string

  /** ISO-8601 timestamp; lower bound on placement (inclusive). */
  @IsOptional()
  @IsISO8601()
  placedFrom?: string

  /** ISO-8601 timestamp; upper bound on placement (inclusive). */
  @IsOptional()
  @IsISO8601()
  placedTo?: string
}
