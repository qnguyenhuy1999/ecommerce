import type { UserRole, UserStatus } from '@ecom/nest-auth'

/**
 * Projection of the authenticated user's own profile returned by
 * `GET /users/me` and `PATCH /users/me`. Intentionally excludes
 * security-sensitive fields (password, refresh tokens) so the shape
 * is safe to send to the client.
 */
export interface UserProfileView {
  id: string
  email: string
  role: UserRole
  status: UserStatus
  emailVerified: boolean
  createdAt: string
  updatedAt: string
}
