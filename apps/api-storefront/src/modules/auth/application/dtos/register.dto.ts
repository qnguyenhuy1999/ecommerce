import { IsEmail, IsOptional, IsString, MaxLength, MinLength } from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class RegisterDto {
  @ApiProperty() @IsEmail() email!: string
  @ApiProperty() @IsString() @MinLength(8) @MaxLength(128) password!: string
  @ApiPropertyOptional() @IsOptional() @IsString() firstName?: string
  @ApiPropertyOptional() @IsOptional() @IsString() lastName?: string
}
