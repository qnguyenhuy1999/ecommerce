import type { AuthSessionResult } from '../../application/types/auth-session-result'

export const COOKIE_WRITER = Symbol('COOKIE_WRITER')
export interface ICookieWriter {
  writeAuthCookies(response: unknown, session: AuthSessionResult): void
  clearAuthCookies(response: unknown): void
}
