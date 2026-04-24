import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { ConfigService } from '@nestjs/config'
import type { Request } from 'express'

export interface JwtRefreshPayload {
  sub: string; family: string; jti: string; rawToken: string
}

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => (req?.cookies as Record<string, string>)?.['refresh_token'] ?? null,
      ]),
      ignoreExpiration: false,
      secretOrKey: config.get<string>('jwt.refreshSecret'),
      passReqToCallback: true,
    })
  }

  validate(req: Request, payload: JwtRefreshPayload) {
    return {
      userId: payload.sub,
      family: payload.family,
      jti: payload.jti,
      rawToken: (req.cookies as Record<string, string>)['refresh_token'] ?? '',
    }
  }
}
