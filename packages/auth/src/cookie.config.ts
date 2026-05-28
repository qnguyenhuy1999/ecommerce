export interface CookieOptions {
  name: string
  httpOnly: boolean
  secure: boolean
  sameSite: 'strict' | 'lax' | 'none'
  domain?: string
  path: string
  maxAge: number
}

export const SESSION_COOKIE_NAME = 'sid'

export function getSessionCookieOptions(domain?: string): CookieOptions {
  const isProduction = process.env.NODE_ENV === 'production'
  const sameSiteFromEnv = process.env.COOKIE_SAMESITE?.toLowerCase()
  const sameSite: CookieOptions['sameSite'] =
    sameSiteFromEnv === 'strict' || sameSiteFromEnv === 'lax' || sameSiteFromEnv === 'none'
      ? sameSiteFromEnv
      : 'lax'

  const secureFromEnv = process.env.COOKIE_SECURE
  const secureBase = secureFromEnv ? secureFromEnv === 'true' : isProduction
  const secure = sameSite === 'none' ? true : secureBase

  const cookieDomain = resolveCookieDomain(domain, isProduction)

  const options: CookieOptions = {
    name: SESSION_COOKIE_NAME,
    httpOnly: true,
    secure,
    sameSite,
    path: '/',
    maxAge: 7 * 24 * 60 * 60,
  }

  if (cookieDomain !== undefined) {
    options.domain = cookieDomain
  }

  return options
}

function resolveCookieDomain(
  domain: string | undefined,
  isProduction: boolean,
): string | undefined {
  if (!domain) return undefined

  const normalizedDomain = domain.trim().toLowerCase()

  const invalidDomains = new Set(['', '.', '.yourdomain.com'])

  if (invalidDomains.has(normalizedDomain)) {
    return undefined
  }

  if (isLocalhostDomain(normalizedDomain)) {
    return undefined
  }

  if (isProduction && !normalizedDomain.startsWith('.')) {
    return `.${normalizedDomain}`
  }

  return normalizedDomain
}

function isLocalhostDomain(domain: string): boolean {
  return (
    domain === 'localhost' ||
    domain === '.localhost' ||
    domain === '127.0.0.1' ||
    domain === '.127.0.0.1' ||
    domain === '[::1]' ||
    domain === '::1'
  )
}
