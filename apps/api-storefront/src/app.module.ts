import { Module } from '@nestjs/common'
import { ThrottlerModule } from '@nestjs/throttler'
import { BullModule } from '@nestjs/bullmq'
import { RedisModule } from '@ecom/redis'
import { EmailModule } from '@ecom/email'
import { DatabaseModule } from '@ecom/database'
import { getDefaultThrottleConfig, getRedisConfig, getSmtpConfig } from '@ecom/config'
import { AuthModule } from './modules/auth/auth.module'
import { ChatModule } from './modules/chat/chat.module'
import { HomepageModule } from './modules/homepage/homepage.module'
import { NotificationsModule } from './modules/notifications/notifications.module'

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
    BullModule.forRoot({
      connection: (() => {
        const { password, ...rest } = getRedisConfig()
        return password !== undefined ? { ...rest, password } : rest
      })(),
    }),
    EmailModule.forRoot(getSmtpConfig()),
    DatabaseModule,
    AuthModule,
    ChatModule,
    HomepageModule,
    NotificationsModule,
  ],
})
export class AppModule {}
