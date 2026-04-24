import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import type { Response } from 'express'
import type { ICookieWriter } from '../../domain/ports/cookie-writer.port'

const ACCESS_COOKIE = 'access_token'
const REFRESH_COOKIE = 'refresh_token'

@Injectable()
export class ExpressCookieWriterAdapter implements ICookieWriter {
  constructor(private readonly config: ConfigService) {}

  private get baseOptions() {
    return {
      httpOnly: true,
      secure: this.config.get<boolean>('cookie.secure', false),
      sameSite: 'strict' as const,
      domain: this.config.get<string | undefined>('cookie.domain') || undefined,
    }
  }

  writeAuthCookies(response: unknown, tokens: { accessToken: string; refreshToken: string }): void {
    const res = response as Response
    res.cookie(ACCESS_COOKIE, tokens.accessToken, {
      ...this.baseOptions,
      path: '/',
      maxAge: 15 * 60 * 1000,
    })
    res.cookie(REFRESH_COOKIE, tokens.refreshToken, {
      ...this.baseOptions,
      path: '/api/v1/auth',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })
  }

  clearAuthCookies(response: unknown): void {
    const res = response as Response
    res.cookie(ACCESS_COOKIE, '', { ...this.baseOptions, path: '/', maxAge: 0 })
    res.cookie(REFRESH_COOKIE, '', { ...this.baseOptions, path: '/api/v1/auth', maxAge: 0 })
  }
}
