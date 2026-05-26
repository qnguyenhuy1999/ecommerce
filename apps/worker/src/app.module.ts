import { Module } from '@nestjs/common'
import { BullModule } from '@nestjs/bullmq'
import { DatabaseModule } from '@ecom/database'
import { EmailModule } from '@ecom/email'
import { RedisModule } from '@ecom/redis'
import { getRedisConfig, getSmtpConfig } from '@ecom/config'
import { CheckoutProcessorModule } from './checkout/checkout.module'
import { NotificationProcessorModule } from './notification/notification.module'
import { OutboxModule } from './outbox/outbox.module'

@Module({
  imports: [
    RedisModule.forRoot(
      (() => {
        const { password, ...rest } = getRedisConfig()
        return password !== undefined ? { ...rest, password } : rest
      })(),
    ),
    BullModule.forRoot({
      connection: {
        host: process.env['REDIS_HOST'] ?? 'localhost',
        port: parseInt(process.env['REDIS_PORT'] ?? '6379', 10),
        password: process.env['REDIS_PASSWORD'],
      },
    }),
    DatabaseModule,
    EmailModule.forRoot(getSmtpConfig()),
    CheckoutProcessorModule,
    NotificationProcessorModule,
    OutboxModule,
  ],
})
export class AppModule {}
