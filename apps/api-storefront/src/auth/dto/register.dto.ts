import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsString, MinLength } from 'class-validator'

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
  password!: string
}
