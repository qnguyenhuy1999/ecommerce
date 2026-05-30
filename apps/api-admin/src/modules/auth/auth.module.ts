import { Global, Module, forwardRef } from '@nestjs/common'
import { APP_GUARD } from '@nestjs/core'
import { ThrottlerGuard } from '@nestjs/throttler'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { SessionProvider, SESSION_SERVICE as ADMIN_SESSION_SERVICE } from './session.provider'
import { SESSION_SERVICE as ECOM_SESSION_SERVICE } from '@ecom/nestjs-core/chat/base-chat.gateway'
import { AuditLogsModule } from '../audit-logs/audit-logs.module'

@Global()
@Module({
  imports: [forwardRef(() => AuditLogsModule)],
  controllers: [AuthController],
  providers: [
    AuthService,
    SessionProvider,
    {
      provide: ECOM_SESSION_SERVICE,
      useExisting: ADMIN_SESSION_SERVICE,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
  exports: [AuthService, SessionProvider, ECOM_SESSION_SERVICE],
})
export class AuthModule {}
