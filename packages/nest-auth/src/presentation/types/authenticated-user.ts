import type { UserRole } from '../../domain/entities/user.entity'

/**
 * Canonical shape of `req.user` after {@link JwtAccessStrategy.validate} runs.
 * Kept in sync with the strategy so controllers that receive it via
 * `@CurrentUser()` don't drift from the actual authenticated payload.
 */
export interface AuthenticatedUser {
  userId: string
  email: string
  role: UserRole
  jti: string
  exp: number
}
