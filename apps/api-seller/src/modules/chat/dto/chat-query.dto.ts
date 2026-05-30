import { IsOptional, IsString } from 'class-validator'
import { OffsetPaginationDto } from '@ecom/shared/pagination/nestjs/offset-pagination.dto'

export class ConversationQueryDto extends OffsetPaginationDto {
  @IsOptional()
  @IsString()
  search?: string
}

export class MessageQueryDto extends OffsetPaginationDto {}
