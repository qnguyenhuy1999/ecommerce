import { Inject, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { randomUUID } from 'node:crypto'

import type { UserEntity } from '../../domain/entities/user.entity'

export interface AccessTokenPayload {
  sub: string
  email: string
  role: string
  jti: string
}

export interface RefreshTokenPayload {
  sub: string
  family: string
  jti: string
}

@Injectable()
export class JwtTokenService {
  constructor(
    private readonly jwt: JwtService,
    @Inject(ConfigService) private readonly config: ConfigService,
  ) {}

  generateAccessToken(user: UserEntity): { token: string; jti: string; expiresInSeconds: number } {
    const jti = randomUUID()
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-arguments -- ConfigService uses NoInfer<T>, preventing inference from the default value; explicit type arg is required
    const expiresIn = this.config.get<string>('jwt.accessExpiresIn', '15m')
    const token = this.jwt.sign(
      { sub: user.id, email: user.email, role: user.role, jti },
      { secret: this.config.get<string>('jwt.accessSecret'), expiresIn },
    )
    const expiresInSeconds = this.parseExpiry(expiresIn)
    return { token, jti, expiresInSeconds }
  }

  generateRefreshToken(
    userId: string,
    family: string,
  ): { token: string; jti: string; expiresInSeconds: number } {
    const jti = randomUUID()
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-arguments -- ConfigService uses NoInfer<T>, preventing inference from the default value; explicit type arg is required
    const expiresIn = this.config.get<string>('jwt.refreshExpiresIn', '7d')
    const token = this.jwt.sign(
      { sub: userId, family, jti },
      { secret: this.config.get<string>('jwt.refreshSecret'), expiresIn },
    )
    const expiresInSeconds = this.parseExpiry(expiresIn)
    return { token, jti, expiresInSeconds }
  }

  parseExpiry(expiry: string): number {
    const match = expiry.match(/^(\d+)([smhdwy])$/)
    if (!match) {
      throw new Error(
        `Unsupported expiry format: "${expiry}". Use a positive integer followed by one of s, m, h, d, w, y.`,
      )
    }
    const val = parseInt(match[1], 10)
    const unit = match[2]
    const multipliers: Record<string, number> = {
      s: 1,
      m: 60,
      h: 3600,
      d: 86400,
      w: 604800,
      y: 31536000,
    }
    return val * (multipliers[unit] ?? 1)
  }
}
