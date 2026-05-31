import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsString } from 'class-validator'

export class LoginDto {
  @ApiProperty({
    description: 'User email address',
    format: 'email',
    example: 'admin@marketplace.com',
  })
  @IsEmail()
  email!: string

  @ApiProperty({ description: 'User password', format: 'password', example: 'Str0ngPassw0rd!' })
  @IsString()
  password!: string
}
