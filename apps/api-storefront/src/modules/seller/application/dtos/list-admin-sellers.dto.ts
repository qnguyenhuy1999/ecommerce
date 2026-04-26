import { Type } from 'class-transformer'
import { IsIn, IsInt, IsOptional, IsString, Max, Min, MinLength } from 'class-validator'

export const ADMIN_SELLER_LIST_STATUSES = ['PENDING', 'APPROVED', 'REJECTED'] as const
export type AdminSellerListStatus = (typeof ADMIN_SELLER_LIST_STATUSES)[number]

export class ListAdminSellersDto {
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
  @IsIn(ADMIN_SELLER_LIST_STATUSES)
  kycStatus?: AdminSellerListStatus

  @IsOptional()
  @IsString()
  @MinLength(1)
  search?: string
}
