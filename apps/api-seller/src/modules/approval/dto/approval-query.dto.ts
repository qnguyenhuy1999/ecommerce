import { IsOptional, IsString, IsEnum } from 'class-validator'
import { OffsetPaginationDto } from '@ecom/shared/pagination/nestjs/offset-pagination.dto'
import { ApprovalStatus } from '@ecom/contracts/enums/product'

export class ApprovalQueryDto extends OffsetPaginationDto {
  @IsOptional()
  @IsString()
  search?: string

  @IsOptional()
  @IsEnum(ApprovalStatus)
  status?: ApprovalStatus
}
