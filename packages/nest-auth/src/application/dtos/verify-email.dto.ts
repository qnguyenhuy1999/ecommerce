import { IsEmail, IsOptional, IsString } from 'class-validator'

export class VerifyEmailDto {
  @IsOptional()
  @IsString()
  token?: string

  @IsOptional()
  @IsEmail()
  email?: string
}
