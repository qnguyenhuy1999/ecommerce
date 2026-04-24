import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { CqrsModule } from '@nestjs/cqrs'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'

import { UserModule } from '../user/user.module'
import { LoginHandler } from './application/commands/login/login.handler'
import { LogoutHandler } from './application/commands/logout/logout.handler'
import { RefreshHandler } from './application/commands/refresh/refresh.handler'
import { RegisterHandler } from './application/commands/register/register.handler'
import { MeHandler } from './application/queries/me/me.handler'
import { JwtTokenService } from './application/services/jwt-token.service'
import { COOKIE_WRITER } from './domain/ports/cookie-writer.port'
import { LOGIN_LIMITER } from './domain/ports/login-limiter.port'
import { PASSWORD_HASHER } from './domain/ports/password-hasher.port'
import { REFRESH_TOKEN_REPOSITORY } from './domain/ports/refresh-token.repository.port'
import { TOKEN_BLACKLIST } from './domain/ports/token-blacklist.port'
import { USER_REPOSITORY } from './domain/ports/user.repository.port'
import { Argon2HasherAdapter } from './infrastructure/adapters/argon2-hasher.adapter'
import { ExpressCookieWriterAdapter } from './infrastructure/adapters/express-cookie-writer.adapter'
import { RedisLoginLimiterAdapter } from './infrastructure/adapters/redis-login-limiter.adapter'
import { RedisTokenBlacklistAdapter } from './infrastructure/adapters/redis-token-blacklist.adapter'
import { PrismaRefreshTokenRepository } from './infrastructure/repositories/prisma-refresh-token.repository'
import { PrismaUserRepository } from './infrastructure/repositories/prisma-user.repository'
import { JwtAccessStrategy } from './infrastructure/strategies/jwt-access.strategy'
import { JwtRefreshStrategy } from './infrastructure/strategies/jwt-refresh.strategy'
import { TokenCleanupTask } from './infrastructure/tasks/token-cleanup.task'
import { AuthController } from './presentation/auth.controller'

const CommandHandlers = [RegisterHandler, LoginHandler, RefreshHandler, LogoutHandler]
const QueryHandlers = [MeHandler]

@Module({
  imports: [
    CqrsModule,
    PassportModule.register({ defaultStrategy: 'jwt-access' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => ({
        secret: cfg.get<string>('jwt.accessSecret'),
        signOptions: { expiresIn: cfg.get('jwt.accessExpiresIn', '15m') },
      }),
    }),
    UserModule,
  ],
  controllers: [AuthController],
  providers: [
    ...CommandHandlers,
    ...QueryHandlers,
    JwtTokenService,
    JwtAccessStrategy,
    JwtRefreshStrategy,
    TokenCleanupTask,
    { provide: USER_REPOSITORY,          useClass: PrismaUserRepository },
    { provide: REFRESH_TOKEN_REPOSITORY, useClass: PrismaRefreshTokenRepository },
    { provide: PASSWORD_HASHER,          useClass: Argon2HasherAdapter },
    { provide: TOKEN_BLACKLIST,          useClass: RedisTokenBlacklistAdapter },
    { provide: COOKIE_WRITER,            useClass: ExpressCookieWriterAdapter },
    { provide: LOGIN_LIMITER,            useClass: RedisLoginLimiterAdapter },
  ],
  exports: [],
})
// eslint-disable-next-line @typescript-eslint/no-extraneous-class -- NestJS module class requires empty body
export class AuthModule {}
