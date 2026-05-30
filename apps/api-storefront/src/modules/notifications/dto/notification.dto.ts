import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsOptional, IsBoolean, IsString } from 'class-validator'
import { Type } from 'class-transformer'
import { OffsetPaginationDto } from '@ecom/shared/pagination/nestjs/offset-pagination.dto'

export class NotificationQueryDto extends OffsetPaginationDto {
  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  unreadOnly?: boolean

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  type?: string
}

export class NotificationResponseDto {
  @ApiProperty()
  id!: string

  @ApiProperty()
  userId!: string

  @ApiProperty()
  type!: string

  @ApiProperty()
  title!: string

  @ApiProperty()
  message!: string

  @ApiProperty()
  isRead!: boolean

  @ApiPropertyOptional({ type: Object })
  metadata?: Record<string, unknown>

  @ApiProperty()
  createdAt!: Date
}

export class NotificationUnreadCountDto {
  @ApiProperty()
  count!: number
}

export class MarkAllNotificationsReadDto {
  @ApiProperty()
  updated!: number
}

export class MarkNotificationReadDto {
  @ApiProperty()
  message!: string
}
