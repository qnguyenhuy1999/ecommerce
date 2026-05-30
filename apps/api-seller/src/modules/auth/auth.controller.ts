import {
  Controller,
  Post,
  Get,
  Body,
  Req,
  Res,
  Query,
  UseGuards,
  UnauthorizedException,
  HttpCode,
  HttpStatus,
} from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { Throttle } from '@nestjs/throttler'
import type { Request, Response } from 'express'
import { getSessionCookieOptions, SESSION_COOKIE_NAME } from '@ecom/auth/cookie.config'
import {
  ApiOkResponseData,
  ApiCreatedResponseData,
  ApiErrorResponses,
  ApiAuth,
} from '@ecom/nestjs-core/openapi'
import { AuthService } from './auth.service'
import { AuthGuard } from './guards/auth.guard'
import { LoginDto } from './dto/login.dto'
import { RegisterDto } from './dto/register.dto'
import { ForgotPasswordDto } from './dto/forgot-password.dto'
import { ResetPasswordDto } from './dto/reset-password.dto'

@ApiTags('Seller/Auth')
@ApiErrorResponses()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Register seller account' })
  @Post('register')
  @ApiCreatedResponseData(Object)
  async register(@Body() dto: RegisterDto) {
    const user = await this.authService.register(dto.email, dto.password, dto.shopName)
    return user
  }

  @ApiOperation({ summary: 'Login to seller panel' })
  @Post('login')
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  @HttpCode(HttpStatus.OK)
  @ApiOkResponseData(Object)
  async login(
    @Body() dto: LoginDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const userAgent = req.headers['user-agent']
    const ipAddress = getClientIp(req)

    const result = await this.authService.login(dto.email, dto.password, userAgent, ipAddress)

    const cookieOptions = getSessionCookieOptions(process.env.COOKIE_DOMAIN)
    res.cookie(cookieOptions.name, result.sessionId, {
      httpOnly: cookieOptions.httpOnly,
      secure: cookieOptions.secure,
      sameSite: cookieOptions.sameSite,
      path: cookieOptions.path,
      maxAge: cookieOptions.maxAge * 1000,
      ...(cookieOptions.domain ? { domain: cookieOptions.domain } : {}),
    })

    return result.seller
  }

  @ApiOperation({ summary: 'Logout from seller panel' })
  @ApiAuth()
  @Post('logout')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOkResponseData(Object)
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const sessionId = getSessionIdFromRequest(req)
    if (sessionId) {
      await this.authService.logout(sessionId)
    }

    const cookieOptions = getSessionCookieOptions(process.env.COOKIE_DOMAIN)
    res.clearCookie(cookieOptions.name, {
      httpOnly: cookieOptions.httpOnly,
      secure: cookieOptions.secure,
      sameSite: cookieOptions.sameSite,
      path: cookieOptions.path,
      ...(cookieOptions.domain ? { domain: cookieOptions.domain } : {}),
    })

    return { data: { success: true } }
  }

  @ApiOperation({ summary: 'Get current seller profile' })
  @ApiAuth()
  @Get('me')
  @UseGuards(AuthGuard)
  @ApiOkResponseData(Object)
  async me(@Req() req: Request) {
    const sessionId = getSessionIdFromRequest(req)
    if (!sessionId) {
      throw new UnauthorizedException('No session cookie')
    }
    return this.authService.getMe(sessionId)
  }

  @ApiOperation({ summary: 'Refresh session' })
  @ApiAuth()
  @Post('refresh')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOkResponseData(Object)
  async refresh(@Req() req: Request) {
    const sessionId = getSessionIdFromRequest(req)
    if (!sessionId) {
      throw new UnauthorizedException('No session cookie')
    }

    await this.authService.refreshSession(sessionId)
    return { data: { success: true } }
  }

  @ApiOperation({ summary: 'Request seller password reset email' })
  @Post('forgot-password')
  @Throttle({ default: { limit: 3, ttl: 60_000 } })
  @HttpCode(HttpStatus.OK)
  @ApiOkResponseData(Object)
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    await this.authService.forgotPassword(dto.email)
    return { data: { success: true } }
  }

  @ApiOperation({ summary: 'Reset seller password with token' })
  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponseData(Object)
  async resetPassword(@Body() dto: ResetPasswordDto) {
    await this.authService.resetPassword(dto.token, dto.password)
    return { data: { success: true } }
  }

  @ApiOperation({ summary: 'Verify seller email' })
  @Get('verify-email')
  @ApiOkResponseData(Object)
  async verifyEmail(@Query('token') token: string) {
    await this.authService.verifyEmail(token)
    return { data: { message: 'Email verified successfully' } }
  }
}

function getClientIp(req: Request): string {
  const forwardedFor = req.headers['x-forwarded-for']
  if (typeof forwardedFor === 'string') {
    return forwardedFor.split(',')[0]?.trim() ?? req.ip ?? ''
  }
  return req.ip ?? ''
}

function getSessionIdFromRequest(req: Request): string | undefined {
  const cookies = req.cookies as unknown
  if (!cookies || typeof cookies !== 'object') return undefined
  const sessionId = (cookies as Record<string, unknown>)[SESSION_COOKIE_NAME]
  return typeof sessionId === 'string' ? sessionId : undefined
}
