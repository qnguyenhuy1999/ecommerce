import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'

// TODO(@platform, 2026-04-23): Implement JWT Passport strategy (typed payload + revocation/rotation rules).
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'dev-secret',
    })
  }

  // TODO(@platform, 2026-04-23): Map payload to an authenticated user object (and enforce revocation).
  // eslint-disable-next-line @typescript-eslint/require-await -- Passport expects async; real implementation will await I/O.
  async validate(payload: unknown) {
    return payload
  }
}
