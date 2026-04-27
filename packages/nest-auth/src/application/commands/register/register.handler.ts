import { ConflictException, Inject, Logger } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { randomUUID } from 'node:crypto'

import { RegisterCommand } from './register.command'
import { EmailAlreadyExistsException } from '../../../domain/exceptions/auth.exceptions'
import { PASSWORD_HASHER, IPasswordHasher } from '../../../domain/ports/password-hasher.port'
import {
  REFRESH_TOKEN_REPOSITORY,
  IRefreshTokenRepository,
} from '../../../domain/ports/refresh-token.repository.port'
import { USER_REPOSITORY, IUserRepository } from '../../../domain/ports/user.repository.port'
import { JwtTokenService } from '../../services/jwt-token.service'
import type { LoginResult } from '../login/login.handler'

@CommandHandler(RegisterCommand)
export class RegisterHandler implements ICommandHandler<RegisterCommand, LoginResult> {
  private readonly logger = new Logger(RegisterHandler.name)

  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepo: IUserRepository,
    @Inject(REFRESH_TOKEN_REPOSITORY) private readonly refreshTokenRepo: IRefreshTokenRepository,
    @Inject(PASSWORD_HASHER) private readonly hasher: IPasswordHasher,
    private readonly jwtTokenService: JwtTokenService,
  ) {}

  async execute(command: RegisterCommand): Promise<LoginResult> {
    const exists = await this.userRepo.existsByEmail(command.email)
    if (exists) throw new ConflictException(new EmailAlreadyExistsException().message)

    const passwordHash = await this.hasher.hash(command.password)
    const user = await this.userRepo.create({ email: command.email, passwordHash })
    await this.userRepo.recordAudit({
      actorId: user.id,
      action: 'AUTH_REGISTER',
      targetType: 'User',
      targetId: user.id,
      metadata: { email: user.email },
    })

    // Issue tokens directly after user creation. Going through LoginCommand
    // would force a second, redundant argon2.verify of the password we just
    // hashed, doubling registration time.
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

    this.logger.log(`New user registered: ${user.id}`)
    return {
      session: {
        tokens: { accessToken, refreshToken },
        expirySeconds: { access: accessExpiresInSeconds, refresh: refreshExpiresInSeconds },
      },
      user: { id: user.id, email: user.email, role: user.role, status: user.status },
    }
  }
}
