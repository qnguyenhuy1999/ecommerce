import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsIn, IsObject, IsOptional, IsString } from 'class-validator'
import { OffsetPaginationDto } from '@ecom/shared/pagination/nestjs/offset-pagination.dto'

export class ConversationQueryDto extends OffsetPaginationDto {
  @IsOptional()
  @IsString()
  search?: string
}

export class MessageQueryDto extends OffsetPaginationDto {}

export class CreateConversationDto {
  @ApiProperty()
  @IsString()
  buyerId!: string

  @ApiProperty()
  @IsString()
  shopId!: string

  @IsOptional()
  @ApiPropertyOptional()
  @IsString()
  productId?: string
}

export class SendChatMessageDto {
  @ApiProperty()
  @IsString()
  content!: string

  @IsOptional()
  @ApiPropertyOptional({ enum: ['TEXT', 'IMAGE', 'PRODUCT'] })
  @IsIn(['TEXT', 'IMAGE', 'PRODUCT'])
  type?: 'TEXT' | 'IMAGE' | 'PRODUCT'

  @IsOptional()
  @ApiPropertyOptional({ type: Object })
  @IsObject()
  metadata?: Record<string, unknown>
}
