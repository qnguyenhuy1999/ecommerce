import { IsOptional, IsString, IsEnum } from 'class-validator'
import { OffsetPaginationDto } from '@ecom/shared/pagination/nestjs/offset-pagination.dto'
import { ReturnStatus } from '@ecom/contracts/enums/order'

export class ReturnQueryDto extends OffsetPaginationDto {
  @IsOptional()
  @IsString()
  search?: string

  @IsOptional()
  @IsEnum(ReturnStatus)
  status?: ReturnStatus
}
