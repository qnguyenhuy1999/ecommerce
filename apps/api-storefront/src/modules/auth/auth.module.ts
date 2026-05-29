import { Module } from '@nestjs/common'
import { APP_GUARD } from '@nestjs/core'
import { ThrottlerGuard } from '@nestjs/throttler'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { AuthGuard } from './guards/auth.guard'
import { SessionProvider } from './session.provider'

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    SessionProvider,
    AuthGuard,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
  exports: [AuthService, SessionProvider, AuthGuard],
})
export class AuthModule {}
