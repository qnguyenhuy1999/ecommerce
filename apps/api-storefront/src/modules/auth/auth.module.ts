import { Module } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { ConfigModule, ConfigService } from '@nestjs/config'

import { UserModule } from '../user/user.module'

import { RegisterHandler } from './application/commands/register/register.handler'
import { LoginHandler } from './application/commands/login/login.handler'
import { RefreshHandler } from './application/commands/refresh/refresh.handler'
import { LogoutHandler } from './application/commands/logout/logout.handler'
import { MeHandler } from './application/queries/me/me.handler'
import { JwtTokenService } from './application/services/jwt-token.service'

import { PrismaUserRepository } from './infrastructure/repositories/prisma-user.repository'
import { PrismaRefreshTokenRepository } from './infrastructure/repositories/prisma-refresh-token.repository'
import { Argon2HasherAdapter } from './infrastructure/adapters/argon2-hasher.adapter'
import { RedisTokenBlacklistAdapter } from './infrastructure/adapters/redis-token-blacklist.adapter'
import { ExpressCookieWriterAdapter } from './infrastructure/adapters/express-cookie-writer.adapter'
import { JwtAccessStrategy } from './infrastructure/strategies/jwt-access.strategy'
import { JwtRefreshStrategy } from './infrastructure/strategies/jwt-refresh.strategy'

import { AuthController } from './presentation/auth.controller'

import { USER_REPOSITORY } from './domain/ports/user.repository.port'
import { REFRESH_TOKEN_REPOSITORY } from './domain/ports/refresh-token.repository.port'
import { PASSWORD_HASHER } from './domain/ports/password-hasher.port'
import { TOKEN_BLACKLIST } from './domain/ports/token-blacklist.port'
import { COOKIE_WRITER } from './domain/ports/cookie-writer.port'

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
        signOptions: { expiresIn: cfg.get<string>('jwt.accessExpiresIn', '15m') },
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
    { provide: USER_REPOSITORY,          useClass: PrismaUserRepository },
    { provide: REFRESH_TOKEN_REPOSITORY, useClass: PrismaRefreshTokenRepository },
    { provide: PASSWORD_HASHER,          useClass: Argon2HasherAdapter },
    { provide: TOKEN_BLACKLIST,          useClass: RedisTokenBlacklistAdapter },
    { provide: COOKIE_WRITER,            useClass: ExpressCookieWriterAdapter },
  ],
  exports: [],
})
export class AuthModule {}
