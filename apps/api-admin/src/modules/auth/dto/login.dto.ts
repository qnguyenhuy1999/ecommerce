import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsString } from 'class-validator'

export class LoginDto {
  @ApiProperty({
    description: 'Admin email address',
    format: 'email',
    example: 'admin@marketplace.com',
  })
  @IsEmail()
  email!: string

  @ApiProperty({ description: 'Admin password', format: 'password', example: 'Str0ngPassw0rd!' })
  @IsString()
  password!: string
}
