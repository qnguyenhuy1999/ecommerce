import { IsNumber, IsOptional, IsString, MaxLength, Min } from 'class-validator'

export class RequestRefundDto {
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  amount?: number

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  reason?: string
}
