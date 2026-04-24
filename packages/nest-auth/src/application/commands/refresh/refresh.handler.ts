import { Inject, Logger, UnauthorizedException } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'

import { RefreshCommand } from './refresh.command'
import type { RefreshTokenEntity } from '../../../domain/entities/refresh-token.entity'
import {
  AccountSuspendedException,
  InvalidCredentialsException,
} from '../../../domain/exceptions/auth.exceptions'
import { PASSWORD_HASHER, IPasswordHasher } from '../../../domain/ports/password-hasher.port'
import {
  REFRESH_TOKEN_REPOSITORY,
  IRefreshTokenRepository,
} from '../../../domain/ports/refresh-token.repository.port'
import { USER_REPOSITORY, IUserRepository } from '../../../domain/ports/user.repository.port'
import { JwtTokenService } from '../../services/jwt-token.service'
import type { LoginResult } from '../login/login.handler'

@CommandHandler(RefreshCommand)
export class RefreshHandler implements ICommandHandler<RefreshCommand, LoginResult> {
  private readonly logger = new Logger(RefreshHandler.name)

  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepo: IUserRepository,
    @Inject(REFRESH_TOKEN_REPOSITORY) private readonly refreshTokenRepo: IRefreshTokenRepository,
    @Inject(PASSWORD_HASHER) private readonly hasher: IPasswordHasher,
    private readonly jwtTokenService: JwtTokenService,
  ) {}

  async execute(command: RefreshCommand): Promise<LoginResult> {
    // findByFamily now returns only active (non-revoked, non-expired) tokens
    const activeTokens = await this.refreshTokenRepo.findByFamily(command.family)

    let currentToken: RefreshTokenEntity | undefined
    for (const token of activeTokens) {
      const matches = await this.hasher.verify(command.jti, token.props.tokenHash)
      if (matches) {
        currentToken = token
        break
      }
    }

    if (!currentToken) {
      // No active token matched — either reuse of a revoked token or an invalid jti.
      // Revoke the entire family as a security response.
      await this.refreshTokenRepo.revokeFamily(command.family)
      this.logger.warn(`Refresh token reuse detected — family revoked: ${command.family}`)
      throw new UnauthorizedException('Refresh token reuse detected')
    }

    const user = await this.userRepo.findById(command.userId)
    if (!user) throw new UnauthorizedException('User not found')

    if (user.status === 'SUSPENDED') {
      await this.refreshTokenRepo.revokeFamily(currentToken.props.family)
      this.logger.warn(`Refresh denied — suspended user: ${user.id}`)
      throw new UnauthorizedException(new AccountSuspendedException().message)
    }
    if (!user.canLogin()) {
      await this.refreshTokenRepo.revokeFamily(currentToken.props.family)
      throw new UnauthorizedException(new InvalidCredentialsException().message)
    }

    const { token: accessToken, expiresInSeconds: accessExpiresInSeconds } =
      this.jwtTokenService.generateAccessToken(user)
    const {
      token: refreshToken,
      jti: newJti,
      expiresInSeconds: refreshExpiresInSeconds,
    } = this.jwtTokenService.generateRefreshToken(user.id, currentToken.props.family)
    const newTokenHash = await this.hasher.hash(newJti)
    const newExpiry = new Date(Date.now() + refreshExpiresInSeconds * 1000)
    const newToken = await this.refreshTokenRepo.create({
      userId: user.id,
      tokenHash: newTokenHash,
      family: currentToken.props.family,
      expiresAt: newExpiry,
    })
    await this.refreshTokenRepo.revokeById(currentToken.props.id, newToken.props.id)

    this.logger.log(`Tokens rotated for user: ${user.id}`)
    return {
      session: {
        tokens: { accessToken, refreshToken },
        expirySeconds: { access: accessExpiresInSeconds, refresh: refreshExpiresInSeconds },
      },
      user: { id: user.id, email: user.email, role: user.role, status: user.status },
    }
  }
}
