import { Inject, UnauthorizedException } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { randomUUID } from 'node:crypto'

import { LoginCommand } from './login.command'
import {
  InvalidCredentialsException,
  AccountSuspendedException,
} from '../../../domain/exceptions/auth.exceptions'
import { PASSWORD_HASHER, IPasswordHasher } from '../../../domain/ports/password-hasher.port'
import {
  REFRESH_TOKEN_REPOSITORY,
  IRefreshTokenRepository,
} from '../../../domain/ports/refresh-token.repository.port'
import { USER_REPOSITORY, IUserRepository } from '../../../domain/ports/user.repository.port'
import { JwtTokenService } from '../../services/jwt-token.service'
import type { AuthSessionResult } from '../../types/auth-session-result'

export interface LoginResult {
  session: AuthSessionResult
  user: { id: string; email: string; role: string; status: string }
}

@CommandHandler(LoginCommand)
export class LoginHandler implements ICommandHandler<LoginCommand, LoginResult> {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepo: IUserRepository,
    @Inject(REFRESH_TOKEN_REPOSITORY) private readonly refreshTokenRepo: IRefreshTokenRepository,
    @Inject(PASSWORD_HASHER) private readonly hasher: IPasswordHasher,
    private readonly jwtTokenService: JwtTokenService,
  ) {}

  async execute(command: LoginCommand): Promise<LoginResult> {
    const user = await this.userRepo.findByEmail(command.email)
    if (!user) throw new UnauthorizedException(new InvalidCredentialsException().message)

    const valid = await this.hasher.verify(command.password, user.passwordHash)
    if (!valid) throw new UnauthorizedException(new InvalidCredentialsException().message)

    if (user.status === 'SUSPENDED')
      throw new UnauthorizedException(new AccountSuspendedException().message)
    if (!user.canLogin()) throw new UnauthorizedException(new InvalidCredentialsException().message)

    const { token: accessToken, expiresInSeconds: accessExpiresInSeconds } =
      this.jwtTokenService.generateAccessToken(user)
    const family = randomUUID()
    const {
      token: refreshToken,
      jti,
      expiresInSeconds: refreshExpiresInSeconds,
    } = this.jwtTokenService.generateRefreshToken(user.id, family)

    const tokenHash = await this.hasher.hash(jti)
    const expiresAt = new Date(Date.now() + refreshExpiresInSeconds * 1000)
    await this.refreshTokenRepo.create({ userId: user.id, tokenHash, family, expiresAt })

    return {
      session: {
        tokens: { accessToken, refreshToken },
        expirySeconds: { access: accessExpiresInSeconds, refresh: refreshExpiresInSeconds },
      },
      user: { id: user.id, email: user.email, role: user.role, status: user.status },
    }
  }
}
