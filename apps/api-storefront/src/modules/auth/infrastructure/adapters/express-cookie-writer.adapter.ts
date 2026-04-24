import { Inject, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import type { Response } from 'express'

import type { AuthSessionResult } from '../../application/types/auth-session-result'
import type { ICookieWriter } from '../../domain/ports/cookie-writer.port'

const ACCESS_COOKIE = 'access_token'
const REFRESH_COOKIE = 'refresh_token'

@Injectable()
export class ExpressCookieWriterAdapter implements ICookieWriter {
  constructor(@Inject(ConfigService) private readonly config: ConfigService) {}

  private get baseOptions() {
    return {
      httpOnly: true,
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-arguments -- ConfigService uses NoInfer<T>, preventing inference from the default value; explicit type arg is required
      secure: this.config.get<boolean>('cookie.secure', true),
      sameSite: 'strict' as const,
      domain: this.config.get<string | undefined>('cookie.domain') || undefined,
    }
  }

  writeAuthCookies(response: unknown, session: AuthSessionResult): void {
    const res = response as Response
    res.cookie(ACCESS_COOKIE, session.tokens.accessToken, {
      ...this.baseOptions,
      path: '/',
      maxAge: session.expirySeconds.access * 1000,
    })
    res.cookie(REFRESH_COOKIE, session.tokens.refreshToken, {
      ...this.baseOptions,
      path: '/api/v1/auth',
      maxAge: session.expirySeconds.refresh * 1000,
    })
  }

  clearAuthCookies(response: unknown): void {
    const res = response as Response
    res.cookie(ACCESS_COOKIE, '', { ...this.baseOptions, path: '/', maxAge: 0 })
    res.cookie(REFRESH_COOKIE, '', { ...this.baseOptions, path: '/api/v1/auth', maxAge: 0 })
  }
}
