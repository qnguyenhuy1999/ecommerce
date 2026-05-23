import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsEnum, IsString, IsOptional, IsNumber, IsDateString, Min, Max } from 'class-validator'
import { Type } from 'class-transformer'
import { CommissionRuleScope } from '@ecom/database'

export class CommissionRuleResponseDto {
  @ApiProperty() id!: string
  @ApiProperty({ enum: CommissionRuleScope }) scope!: CommissionRuleScope
  @ApiProperty() label!: string
  @ApiPropertyOptional() targetId!: string | null
  @ApiProperty() commissionPct!: number
  @ApiProperty() paymentFeePct!: number
  @ApiProperty() effectiveFrom!: Date
  @ApiProperty() createdAt!: Date
  @ApiProperty() updatedAt!: Date
}

export class CreateCommissionRuleDto {
  @ApiProperty({ enum: CommissionRuleScope })
  @IsEnum(CommissionRuleScope)
  scope!: CommissionRuleScope

  @ApiProperty()
  @IsString()
  label!: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  targetId?: string

  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(100)
  commissionPct!: number

  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(100)
  paymentFeePct!: number

  @ApiProperty()
  @IsDateString()
  effectiveFrom!: string
}

export class UpdateCommissionRuleDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  label?: string

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(100)
  commissionPct?: number

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(100)
  paymentFeePct?: number

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  effectiveFrom?: string
}
