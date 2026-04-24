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
import { RegisterDto } from '../application/dtos/register.dto'
import { MeQuery } from '../application/queries/me/me.query'
import type { UserEntity } from '../domain/entities/user.entity'
import { COOKIE_WRITER, ICookieWriter } from '../domain/ports/cookie-writer.port'

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
