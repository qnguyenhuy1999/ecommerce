import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { Inject, UnauthorizedException } from '@nestjs/common'
import { randomUUID } from 'node:crypto'
import { LoginCommand } from './login.command'
import { USER_REPOSITORY, IUserRepository } from '../../../domain/ports/user.repository.port'
import { REFRESH_TOKEN_REPOSITORY, IRefreshTokenRepository } from '../../../domain/ports/refresh-token.repository.port'
import { PASSWORD_HASHER, IPasswordHasher } from '../../../domain/ports/password-hasher.port'
import { JwtTokenService } from '../../services/jwt-token.service'
import { InvalidCredentialsException, AccountSuspendedException } from '../../../domain/exceptions/auth.exceptions'

export interface LoginResult {
  accessToken: string; refreshToken: string
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

    if (user.status === 'SUSPENDED') throw new UnauthorizedException(new AccountSuspendedException().message)
    if (!user.canLogin()) throw new UnauthorizedException(new InvalidCredentialsException().message)

    const { token: accessToken } = this.jwtTokenService.generateAccessToken(user)
    const family = randomUUID()
    const { token: refreshToken, rawToken } = this.jwtTokenService.generateRefreshToken(user.id, family)

    const tokenHash = await this.hasher.hash(rawToken)
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    await this.refreshTokenRepo.create({ userId: user.id, tokenHash, family, expiresAt })

    return { accessToken, refreshToken, user: { id: user.id, email: user.email, role: user.role, status: user.status } }
  }
}
