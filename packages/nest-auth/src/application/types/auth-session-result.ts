export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

export interface AuthTokenExpirySeconds {
  access: number
  refresh: number
}

export interface AuthSessionResult {
  tokens: AuthTokens
  expirySeconds: AuthTokenExpirySeconds
}
