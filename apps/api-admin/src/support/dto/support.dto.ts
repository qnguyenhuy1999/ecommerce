import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsBoolean, IsEnum, IsInt, IsOptional, IsString, Min, ValidateIf } from 'class-validator'
import { Type } from 'class-transformer'
import { SupportTicketStatus } from '@ecom/database'

export class SupportTicketQueryDto {
  @ApiPropertyOptional() @IsOptional() @Type(() => Number) @IsInt() @Min(1) page?: number
  @ApiPropertyOptional() @IsOptional() @Type(() => Number) @IsInt() @Min(1) limit?: number
  @ApiPropertyOptional({ enum: SupportTicketStatus }) @IsOptional() @IsEnum(SupportTicketStatus) status?: SupportTicketStatus
  @ApiPropertyOptional() @IsOptional() @IsString() search?: string
}

export class SupportTicketResponseDto {
  @ApiProperty() id!: string
  @ApiProperty() title!: string
  @ApiPropertyOptional() description!: string | null
  @ApiProperty() submitterId!: string
  @ApiProperty() submitterRole!: string
  @ApiProperty() submitterName!: string
  @ApiProperty({ enum: SupportTicketStatus }) status!: SupportTicketStatus
  @ApiPropertyOptional() assignedAdminId!: string | null
  @ApiProperty() createdAt!: Date
  @ApiProperty() updatedAt!: Date
}

export class SupportMessageResponseDto {
  @ApiProperty() id!: string
  @ApiProperty() ticketId!: string
  @ApiProperty() sender!: string
  @ApiProperty() senderName!: string
  @ApiProperty() content!: string
  @ApiProperty() isInternal!: boolean
  @ApiProperty() createdAt!: Date
}

export class SendReplyDto {
  @ApiProperty() @IsString() content!: string
  @ApiProperty() @IsBoolean() isInternal!: boolean
}

export class ChangeStatusDto {
  @ApiProperty({ enum: SupportTicketStatus })
  @IsEnum(SupportTicketStatus)
  status!: SupportTicketStatus
}

export class ChangeAssigneeDto {
  @ApiPropertyOptional({ nullable: true })
  @ValidateIf((o: ChangeAssigneeDto) => o.assignedAdminId !== null)
  @IsOptional()
  @IsString()
  assignedAdminId!: string | null
}
