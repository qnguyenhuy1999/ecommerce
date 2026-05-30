import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsOptional, IsString } from 'class-validator'
import { OffsetPaginationDto } from '@ecom/shared/pagination/nestjs/offset-pagination.dto'

export class ConversationQueryDto extends OffsetPaginationDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  search?: string
}

export class MessageQueryDto extends OffsetPaginationDto {}

export class CreateConversationDto {
  @ApiProperty()
  @IsString()
  shopId!: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  productId?: string
}

export class SendMessageDto {
  @ApiProperty()
  @IsString()
  content!: string

  @ApiPropertyOptional({ enum: ['TEXT', 'IMAGE', 'PRODUCT'] })
  @IsOptional()
  @IsString()
  type?: 'TEXT' | 'IMAGE' | 'PRODUCT'
}
