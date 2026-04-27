import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { createHmac, timingSafeEqual } from 'node:crypto'

@Injectable()
export class AuthTokenService {
  constructor(private readonly config: ConfigService) {}

  signEmailVerification(userId: string, email: string): string {
    return this.sign('verify', userId, email, 7 * 24 * 60 * 60)
  }

  signPasswordReset(userId: string, email: string): string {
    return this.sign('reset', userId, email, 60 * 60)
  }

  verify(token: string, purpose: 'verify' | 'reset'): { userId: string; email: string } | null {
    const parts = token.split('.')
    if (parts.length !== 2) return null
    const payloadJson = Buffer.from(parts[0] ?? '', 'base64url').toString('utf8')
    let payload: { purpose?: string; userId?: string; email?: string; exp?: number }
    try {
      payload = JSON.parse(payloadJson) as { purpose?: string; userId?: string; email?: string; exp?: number }
    } catch {
      return null
    }
    if (
      payload.purpose !== purpose ||
      !payload.userId ||
      !payload.email ||
      !payload.exp ||
      payload.exp < Math.floor(Date.now() / 1000)
    ) {
      return null
    }
    const expected = this.digest(parts[0] ?? '')
    const actual = Buffer.from(parts[1] ?? '', 'base64url')
    if (actual.length !== expected.length || !timingSafeEqual(actual, expected)) return null
    return { userId: payload.userId, email: payload.email }
  }

  private sign(purpose: 'verify' | 'reset', userId: string, email: string, ttlSeconds: number): string {
    const payload = Buffer.from(
      JSON.stringify({
        purpose,
        userId,
        email,
        exp: Math.floor(Date.now() / 1000) + ttlSeconds,
      }),
    ).toString('base64url')
    return `${payload}.${this.digest(payload).toString('base64url')}`
  }

  private digest(payload: string): Buffer {
    return createHmac('sha256', this.config.get<string>('jwt.accessSecret') ?? 'dev-secret')
      .update(payload)
      .digest()
  }
}
