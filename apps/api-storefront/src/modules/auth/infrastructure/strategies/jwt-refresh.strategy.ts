import { Inject, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import type { Request } from 'express'
import { ExtractJwt, Strategy } from 'passport-jwt'

export interface JwtRefreshPayload {
  sub: string; family: string; jti: string
}

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(@Inject(ConfigService) private readonly config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => (req.cookies as Record<string, string | undefined>)['refresh_token'] ?? null,
      ]),
      ignoreExpiration: false,
      secretOrKey: config.get<string>('jwt.refreshSecret'),
      passReqToCallback: false,
    })
  }

  validate(payload: JwtRefreshPayload) {
    return {
      userId: payload.sub,
      family: payload.family,
      jti: payload.jti,
    }
  }
}
