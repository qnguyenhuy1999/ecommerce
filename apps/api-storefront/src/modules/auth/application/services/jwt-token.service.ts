import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { randomUUID, randomBytes } from 'node:crypto'
import type { UserEntity } from '../../domain/entities/user.entity'

export interface AccessTokenPayload {
  sub: string; email: string; role: string; jti: string
}

export interface RefreshTokenPayload {
  sub: string; family: string; jti: string; rawToken: string
}

@Injectable()
export class JwtTokenService {
  constructor(
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  generateAccessToken(user: UserEntity): { token: string; jti: string; expiresInSeconds: number } {
    const jti = randomUUID()
    const expiresIn = this.config.get<string>('jwt.accessExpiresIn', '15m')
    const token = this.jwt.sign(
      { sub: user.id, email: user.email, role: user.role, jti },
      { secret: this.config.get<string>('jwt.accessSecret'), expiresIn },
    )
    const expiresInSeconds = this.parseExpiry(expiresIn)
    return { token, jti, expiresInSeconds }
  }

  generateRefreshToken(userId: string, family: string): { token: string; rawToken: string } {
    const rawToken = randomBytes(64).toString('hex')
    const jti = randomUUID()
    const expiresIn = this.config.get<string>('jwt.refreshExpiresIn', '7d')
    const token = this.jwt.sign(
      { sub: userId, family, jti, rawToken },
      { secret: this.config.get<string>('jwt.refreshSecret'), expiresIn },
    )
    return { token, rawToken }
  }

  verifyRefreshToken(token: string): RefreshTokenPayload {
    return this.jwt.verify<RefreshTokenPayload>(token, {
      secret: this.config.get<string>('jwt.refreshSecret'),
    })
  }

  private parseExpiry(expiry: string): number {
    const match = expiry.match(/^(\d+)([smhd])$/)
    if (!match) return 900
    const val = parseInt(match[1], 10)
    const unit = match[2]
    const multipliers: Record<string, number> = { s: 1, m: 60, h: 3600, d: 86400 }
    return val * (multipliers[unit] ?? 1)
  }
}
