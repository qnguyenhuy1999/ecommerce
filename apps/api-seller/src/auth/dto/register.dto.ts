import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsEmail, IsString, MinLength, MaxLength, IsOptional } from 'class-validator'

export class RegisterDto {
  @ApiProperty({ description: 'User email address', format: 'email', example: 'user@example.com' })
  @IsEmail()
  email!: string

  @ApiProperty({
    description: 'User password (minimum 8 characters)',
    format: 'password',
    minLength: 8,
  })
  @IsString()
  @MinLength(8)
  @MaxLength(128)
  password!: string

  @ApiPropertyOptional({ description: 'Optional shop name', example: 'Marketplace Store' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  shopName?: string
}
