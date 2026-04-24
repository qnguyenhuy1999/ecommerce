export const TOKEN_BLACKLIST = Symbol('TOKEN_BLACKLIST')
export interface ITokenBlacklist {
  blacklist(jti: string, ttlSeconds: number): Promise<void>
  isBlacklisted(jti: string): Promise<boolean>
}
