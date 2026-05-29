export const CSRF_TOKEN_HEADER = 'x-csrf-token' as const

export const CSRF_SAFE_METHODS = ['GET', 'HEAD', 'OPTIONS'] as const

export type CsrfSafeMethod = (typeof CSRF_SAFE_METHODS)[number]

export interface CsrfProtectionConfig {
  trustedOrigins: readonly string[]
}

export function isCsrfSafeMethod(method: string): method is CsrfSafeMethod {
  return CSRF_SAFE_METHODS.includes(method.toUpperCase() as CsrfSafeMethod)
}

export function isTrustedOrigin(origin: string | undefined, config: CsrfProtectionConfig): boolean {
  if (!origin) {
    return false
  }
  return config.trustedOrigins.includes(origin)
}
