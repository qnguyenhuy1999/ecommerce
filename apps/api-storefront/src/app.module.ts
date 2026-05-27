import { Module } from '@nestjs/common'
import { ThrottlerModule } from '@nestjs/throttler'
import { RedisModule } from '@ecom/redis'
import { EmailModule } from '@ecom/email'
import { DatabaseModule } from '@ecom/database'
import { getDefaultThrottleConfig, getRedisConfig, getSmtpConfig } from '@ecom/config'
import { AuthModule } from './auth/auth.module'
import { ChatModule } from './chat/chat.module'
import { HomepageModule } from './homepage/homepage.module'
import { NotificationsModule } from './notifications/notifications.module'

@Module({
  imports: [
    ThrottlerModule.forRoot({
      throttlers: [getDefaultThrottleConfig()],
    }),
    RedisModule.forRoot(
      (() => {
        const { password, ...rest } = getRedisConfig()
        return password !== undefined ? { ...rest, password } : rest
      })(),
    ),
    EmailModule.forRoot(getSmtpConfig()),
    DatabaseModule,
    AuthModule,
    ChatModule,
    HomepageModule,
    NotificationsModule,
  ],
})
export class AppModule {}
