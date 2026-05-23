import { Module } from '@nestjs/common'
import { DatabaseModule } from '@ecom/database'
import { RedisModule } from '@ecom/redis'
import { getRedisConfig } from '@ecom/config'
import { CheckoutProcessorModule } from './checkout/checkout.module'

@Module({
  imports: [
    RedisModule.forRoot(
      (() => {
        const { password, ...rest } = getRedisConfig()
        return password !== undefined ? { ...rest, password } : rest
      })(),
    ),
    DatabaseModule,
    CheckoutProcessorModule,
  ],
})
export class AppModule {}
