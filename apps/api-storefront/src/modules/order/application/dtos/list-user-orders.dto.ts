import { Type } from 'class-transformer'
import { IsIn, IsInt, IsOptional, Max, Min } from 'class-validator'

export const ORDER_SORT_FIELDS = ['createdAt'] as const
export type OrderSortField = (typeof ORDER_SORT_FIELDS)[number]

export const ORDER_SORT_ORDERS = ['asc', 'desc'] as const
export type OrderSortOrder = (typeof ORDER_SORT_ORDERS)[number]

export const ORDER_HISTORY_STATUSES = [
  'PENDING_PAYMENT',
  'PAID',
  'PROCESSING',
  'SHIPPED',
  'COMPLETED',
  'CANCELLED',
  'REFUNDED',
  'PENDING_REFUND',
] as const
export type OrderHistoryStatusFilter = (typeof ORDER_HISTORY_STATUSES)[number]

export class ListUserOrdersDto {
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
  @IsIn(ORDER_SORT_FIELDS)
  sort: OrderSortField = 'createdAt'

  @IsOptional()
  @IsIn(ORDER_SORT_ORDERS)
  order: OrderSortOrder = 'desc'

  @IsOptional()
  @IsIn(ORDER_HISTORY_STATUSES)
  status?: OrderHistoryStatusFilter
}
