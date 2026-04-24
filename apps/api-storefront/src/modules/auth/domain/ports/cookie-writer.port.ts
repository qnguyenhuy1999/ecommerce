export const COOKIE_WRITER = Symbol('COOKIE_WRITER')
export interface ICookieWriter {
  writeAuthCookies(response: unknown, tokens: { accessToken: string; refreshToken: string }): void
  clearAuthCookies(response: unknown): void
}
