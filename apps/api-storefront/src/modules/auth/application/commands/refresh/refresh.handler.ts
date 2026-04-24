import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { Inject, UnauthorizedException } from '@nestjs/common'
import { RefreshCommand } from './refresh.command'
import { USER_REPOSITORY, IUserRepository } from '../../../domain/ports/user.repository.port'
import { REFRESH_TOKEN_REPOSITORY, IRefreshTokenRepository } from '../../../domain/ports/refresh-token.repository.port'
import { PASSWORD_HASHER, IPasswordHasher } from '../../../domain/ports/password-hasher.port'
import { JwtTokenService } from '../../services/jwt-token.service'
import type { LoginResult } from '../login/login.handler'

@CommandHandler(RefreshCommand)
export class RefreshHandler implements ICommandHandler<RefreshCommand, LoginResult> {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepo: IUserRepository,
    @Inject(REFRESH_TOKEN_REPOSITORY) private readonly refreshTokenRepo: IRefreshTokenRepository,
    @Inject(PASSWORD_HASHER) private readonly hasher: IPasswordHasher,
    private readonly jwtTokenService: JwtTokenService,
  ) {}

  async execute(command: RefreshCommand): Promise<LoginResult> {
    let payload: ReturnType<JwtTokenService['verifyRefreshToken']>
    try {
      payload = this.jwtTokenService.verifyRefreshToken(command.rawRefreshToken)
    } catch {
      throw new UnauthorizedException('Invalid refresh token')
    }

    const allFamilyTokens = await this.refreshTokenRepo.findByFamily(payload.family)
    const currentToken = allFamilyTokens.find(t => !t.isRevoked() && !t.isExpired())

    if (!currentToken) {
      await this.refreshTokenRepo.revokeFamily(payload.family)
      throw new UnauthorizedException('Refresh token reuse detected')
    }

    const isValid = await this.hasher.verify(payload.rawToken, currentToken.props.tokenHash)
    if (!isValid) {
      await this.refreshTokenRepo.revokeFamily(payload.family)
      throw new UnauthorizedException('Refresh token reuse detected')
    }

    const user = await this.userRepo.findById(payload.sub)
    if (!user) throw new UnauthorizedException('User not found')

    const { token: accessToken } = this.jwtTokenService.generateAccessToken(user)
    const { token: refreshToken, rawToken: newRawToken } = this.jwtTokenService.generateRefreshToken(user.id, currentToken.props.family)
    const newTokenHash = await this.hasher.hash(newRawToken)
    const newExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    const newToken = await this.refreshTokenRepo.create({
      userId: user.id, tokenHash: newTokenHash, family: currentToken.props.family, expiresAt: newExpiry,
    })
    await this.refreshTokenRepo.revokeById(currentToken.props.id, newToken.props.id)

    return { accessToken, refreshToken, user: { id: user.id, email: user.email, role: user.role, status: user.status } }
  }
}
