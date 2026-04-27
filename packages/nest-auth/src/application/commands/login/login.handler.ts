import { Inject, Logger, UnauthorizedException } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { randomUUID } from 'node:crypto'

import { LoginCommand } from './login.command'
import {
  InvalidCredentialsException,
  AccountSuspendedException,
} from '../../../domain/exceptions/auth.exceptions'
import { LOGIN_LIMITER, ILoginLimiter } from '../../../domain/ports/login-limiter.port'
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
  private readonly logger = new Logger(LoginHandler.name)

  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepo: IUserRepository,
    @Inject(REFRESH_TOKEN_REPOSITORY) private readonly refreshTokenRepo: IRefreshTokenRepository,
    @Inject(PASSWORD_HASHER) private readonly hasher: IPasswordHasher,
    @Inject(LOGIN_LIMITER) private readonly loginLimiter: ILoginLimiter,
    private readonly jwtTokenService: JwtTokenService,
  ) {}

  async execute(command: LoginCommand): Promise<LoginResult> {
    const locked = await this.loginLimiter.isLocked(command.email)
    if (locked) {
      this.logger.warn(`Login blocked — account locked: ${command.email}`)
      throw new UnauthorizedException('Too many failed attempts. Try again in 15 minutes.')
    }

    const user = await this.userRepo.findByEmail(command.email)
    if (!user) {
      await this.loginLimiter.recordFailure(command.email)
      await this.userRepo.recordAudit({
        actorId: null,
        action: 'AUTH_LOGIN_FAILED',
        targetType: 'User',
        targetId: null,
        metadata: { email: command.email, reason: 'not_found' },
      })
      throw new UnauthorizedException(new InvalidCredentialsException().message)
    }

    const valid = await this.hasher.verify(command.password, user.passwordHash)
    if (!valid) {
      const attempts = await this.loginLimiter.recordFailure(command.email)
      this.logger.warn(`Failed login attempt ${String(attempts)}/5 for user: ${user.id}`)
      await this.userRepo.recordAudit({
        actorId: user.id,
        action: 'AUTH_LOGIN_FAILED',
        targetType: 'User',
        targetId: user.id,
        metadata: { email: command.email, reason: 'bad_password', attempts },
      })
      throw new UnauthorizedException(new InvalidCredentialsException().message)
    }

    if (user.status === 'SUSPENDED') {
      this.logger.warn(`Login denied — suspended user: ${user.id}`)
      throw new UnauthorizedException(new AccountSuspendedException().message)
    }
    if (!user.canLogin()) {
      throw new UnauthorizedException(new InvalidCredentialsException().message)
    }

    await this.loginLimiter.reset(command.email)

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
    await this.userRepo.recordAudit({
      actorId: user.id,
      action: 'AUTH_LOGIN',
      targetType: 'User',
      targetId: user.id,
      metadata: { family },
    })

    this.logger.log(`User logged in: ${user.id}`)
    return {
      session: {
        tokens: { accessToken, refreshToken },
        expirySeconds: { access: accessExpiresInSeconds, refresh: refreshExpiresInSeconds },
      },
      user: { id: user.id, email: user.email, role: user.role, status: user.status },
    }
  }
}
