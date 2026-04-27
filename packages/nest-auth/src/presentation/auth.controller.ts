import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  UnauthorizedException,
  UseGuards,
  Inject,
  BadRequestException,
} from '@nestjs/common'
import { CommandBus, QueryBus } from '@nestjs/cqrs'
import { ApiCookieAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { Throttle } from '@nestjs/throttler'
import type { Response } from 'express'

import { CurrentUser } from './decorators/current-user.decorator'
import { JwtAccessGuard } from './guards/jwt-access.guard'
import { JwtRefreshGuard } from './guards/jwt-refresh.guard'
import { LoginCommand } from '../application/commands/login/login.command'
import type { LoginResult } from '../application/commands/login/login.handler'
import { LogoutCommand } from '../application/commands/logout/logout.command'
import { RefreshCommand } from '../application/commands/refresh/refresh.command'
import { RegisterCommand } from '../application/commands/register/register.command'
import { AuthResponseDto } from '../application/dtos/auth-response.dto'
import { LoginDto } from '../application/dtos/login.dto'
import { ForgotPasswordDto, ResetPasswordDto } from '../application/dtos/password-reset.dto'
import { RegisterDto } from '../application/dtos/register.dto'
import { VerifyEmailDto } from '../application/dtos/verify-email.dto'
import { MeQuery } from '../application/queries/me/me.query'
import { AuthTokenService } from '../application/services/auth-token.service'
import type { UserEntity } from '../domain/entities/user.entity'
import { COOKIE_WRITER, ICookieWriter } from '../domain/ports/cookie-writer.port'
import { PASSWORD_HASHER, IPasswordHasher } from '../domain/ports/password-hasher.port'
import { USER_REPOSITORY, IUserRepository } from '../domain/ports/user.repository.port'

interface AuthenticatedUser {
  userId: string
  email: string
  role: string
  jti: string
  exp: number
}

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    @Inject(COOKIE_WRITER) private readonly cookieWriter: ICookieWriter,
    @Inject(USER_REPOSITORY) private readonly userRepo: IUserRepository,
    @Inject(PASSWORD_HASHER) private readonly hasher: IPasswordHasher,
    private readonly authTokenService: AuthTokenService,
  ) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @Throttle({ default: { ttl: 900_000, limit: 5 } })
  @ApiOperation({ summary: 'Register a new account' })
  async register(
    @Body() dto: RegisterDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<AuthResponseDto> {
    const result = await this.commandBus.execute<RegisterCommand, LoginResult>(
      new RegisterCommand(dto.email, dto.password),
    )
    this.cookieWriter.writeAuthCookies(res, result.session)
    return { user: result.user }
  }

  @Post('verify-email')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify an account email address.' })
  async verifyEmail(@Body() dto: VerifyEmailDto): Promise<{ message: string; verificationToken?: string }> {
    if (dto.token) {
      const payload = this.authTokenService.verify(dto.token, 'verify')
      if (!payload) throw new BadRequestException('Invalid or expired verification token')
      await this.userRepo.verifyEmail(payload.userId)
      await this.userRepo.recordAudit({
        actorId: payload.userId,
        action: 'AUTH_EMAIL_VERIFIED',
        targetType: 'User',
        targetId: payload.userId,
        metadata: { email: payload.email },
      })
      return { message: 'Email verified' }
    }

    if (!dto.email) throw new BadRequestException('Email or token is required')
    const user = await this.userRepo.findByEmail(dto.email)
    if (!user) return { message: 'If the email exists, a verification link will be sent.' }
    return {
      message: 'Verification token generated',
      verificationToken: this.authTokenService.signEmailVerification(user.id, user.email),
    }
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Start password reset flow.' })
  async forgotPassword(@Body() dto: ForgotPasswordDto): Promise<{ message: string; resetToken?: string }> {
    const user = await this.userRepo.findByEmail(dto.email)
    if (!user) return { message: 'If the email exists, a reset link will be sent.' }
    return {
      message: 'Reset token generated',
      resetToken: this.authTokenService.signPasswordReset(user.id, user.email),
    }
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reset password with a reset token.' })
  async resetPassword(@Body() dto: ResetPasswordDto): Promise<{ message: string }> {
    const payload = this.authTokenService.verify(dto.token, 'reset')
    if (!payload) throw new BadRequestException('Invalid or expired reset token')
    const passwordHash = await this.hasher.hash(dto.password)
    await this.userRepo.updatePassword(payload.userId, passwordHash)
    await this.userRepo.recordAudit({
      actorId: payload.userId,
      action: 'AUTH_PASSWORD_RESET',
      targetType: 'User',
      targetId: payload.userId,
      metadata: { email: payload.email },
    })
    return { message: 'Password updated' }
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { ttl: 900_000, limit: 5 } })
  @ApiOperation({ summary: 'Login with email and password' })
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<AuthResponseDto> {
    const result = await this.commandBus.execute<LoginCommand, LoginResult>(
      new LoginCommand(dto.email, dto.password),
    )
    this.cookieWriter.writeAuthCookies(res, result.session)
    return { user: result.user }
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtRefreshGuard)
  @Throttle({ default: { ttl: 60_000, limit: 30 } })
  @ApiOperation({ summary: 'Rotate tokens using refresh cookie' })
  async refresh(
    @CurrentUser() user: { userId: string; family: string; jti: string },
    @Res({ passthrough: true }) res: Response,
  ): Promise<AuthResponseDto> {
    const result = await this.commandBus.execute<RefreshCommand, LoginResult>(
      new RefreshCommand(user.userId, user.family, user.jti),
    )
    this.cookieWriter.writeAuthCookies(res, result.session)
    return { user: result.user }
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAccessGuard)
  @ApiCookieAuth('access_token')
  @ApiOperation({ summary: 'Logout and invalidate all tokens' })
  async logout(
    @CurrentUser() user: AuthenticatedUser,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ message: string }> {
    const remaining = Math.max(0, user.exp - Math.floor(Date.now() / 1000))
    await this.commandBus.execute(new LogoutCommand(user.userId, user.jti, remaining))
    this.cookieWriter.clearAuthCookies(res)
    return { message: 'Logged out successfully' }
  }

  @Get('me')
  @UseGuards(JwtAccessGuard)
  @ApiCookieAuth('access_token')
  @ApiOperation({ summary: 'Get current authenticated user' })
  async me(@CurrentUser() user: AuthenticatedUser): Promise<AuthResponseDto> {
    const entity = await this.queryBus.execute<MeQuery, UserEntity | null>(new MeQuery(user.userId))
    if (!entity) throw new UnauthorizedException('User not found')
    return {
      user: { id: entity.id, email: entity.email, role: entity.role, status: entity.status },
    }
  }
}
