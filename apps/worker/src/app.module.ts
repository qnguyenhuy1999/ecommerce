import { Module } from '@nestjs/common'
import { BullModule } from '@nestjs/bullmq'
import { DatabaseModule } from '@ecom/database'
import { RedisModule } from '@ecom/redis'
import { getRedisConfig } from '@ecom/config'
import { CheckoutProcessorModule } from './checkout/checkout.module'
import { NotificationProcessorModule } from './notification/notification.module'

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
    CheckoutProcessorModule,
    NotificationProcessorModule,
  ],
})
export class AppModule {}
