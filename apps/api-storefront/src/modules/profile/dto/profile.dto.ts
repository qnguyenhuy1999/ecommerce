import { IsOptional, IsString, MaxLength, Matches } from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class ProfileDto {
  @ApiProperty() id!: string
  @ApiProperty() email!: string
  @ApiProperty({ nullable: true, type: String }) firstName!: string | null
  @ApiProperty({ nullable: true, type: String }) lastName!: string | null
  @ApiProperty({ nullable: true, type: String }) phone!: string | null
  @ApiProperty() emailVerified!: boolean
  @ApiProperty({ type: 'string', format: 'date-time' }) createdAt!: Date
}

export class UpdateProfileDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(64)
  firstName?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(64)
  lastName?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Matches(/^\+?[0-9\s\-()]{7,20}$/, { message: 'Invalid phone number' })
  phone?: string
}
