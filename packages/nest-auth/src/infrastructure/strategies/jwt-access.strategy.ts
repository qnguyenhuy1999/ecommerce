import { Inject, Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import type { Request } from 'express'
import { ExtractJwt, Strategy } from 'passport-jwt'

import { TOKEN_BLACKLIST, ITokenBlacklist } from '../../domain/ports/token-blacklist.port'

export interface JwtAccessPayload {
  sub: string
  email: string
  role: string
  jti: string
  iat: number
  exp: number
}

@Injectable()
export class JwtAccessStrategy extends PassportStrategy(Strategy, 'jwt-access') {
  constructor(
    @Inject(ConfigService) config: ConfigService,
    @Inject(TOKEN_BLACKLIST) private readonly blacklist: ITokenBlacklist,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) =>
          (req.cookies as Record<string, string | undefined>)['access_token'] ?? null,
      ]),
      ignoreExpiration: false,
      secretOrKey: config.get<string>('jwt.accessSecret'),
      passReqToCallback: false,
    })
  }

  async validate(payload: JwtAccessPayload) {
    const revoked = await this.blacklist.isBlacklisted(payload.jti)
    if (revoked) throw new UnauthorizedException('Token has been revoked')
    return {
      userId: payload.sub,
      email: payload.email,
      role: payload.role,
      jti: payload.jti,
      exp: payload.exp,
    }
  }
}
