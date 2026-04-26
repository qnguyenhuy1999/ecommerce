import { IsEmail, IsOptional, MaxLength } from 'class-validator'

/**
 * Only profile fields the buyer is allowed to change through
 * `PATCH /users/me`. Security-sensitive fields (password, role,
 * status, emailVerified) are deliberately NOT part of this DTO —
 * the global `ValidationPipe` is configured with `whitelist: true`
 * and `forbidNonWhitelisted: true`, so unknown fields are rejected.
 */
export class UpdateMyProfileDto {
  @IsOptional()
  @IsEmail()
  @MaxLength(254)
  email?: string
}
