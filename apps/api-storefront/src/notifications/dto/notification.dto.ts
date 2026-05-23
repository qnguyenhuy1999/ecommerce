import { IsOptional, IsBoolean, IsString } from 'class-validator'
import { Type } from 'class-transformer'
import { OffsetPaginationDto } from '@ecom/shared/pagination/nestjs'

export class NotificationQueryDto extends OffsetPaginationDto {
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  unreadOnly?: boolean

  @IsOptional()
  @IsString()
  type?: string
}

export class NotificationResponseDto {
  id!: string
  userId!: string
  type!: string
  title!: string
  message!: string
  isRead!: boolean
  metadata?: Record<string, unknown>
  createdAt!: Date
}
