import { Module } from '@nestjs/common'
import { BullModule } from '@nestjs/bullmq'
import { AuthModule } from '../auth/auth.module'
import { CheckoutController } from './checkout.controller'
import { CheckoutService } from './checkout.service'
import { QUEUES } from '@ecom/shared'

@Module({
  imports: [
    AuthModule,
    BullModule.forRoot({
      connection: {
        host: process.env['REDIS_HOST'] ?? 'localhost',
        port: parseInt(process.env['REDIS_PORT'] ?? '6379', 10),
        password: process.env['REDIS_PASSWORD'],
      },
    }),
    BullModule.registerQueue({ name: QUEUES.ORDER_PROCESSING }),
  ],
  controllers: [CheckoutController],
  providers: [CheckoutService],
})
export class CheckoutModule {}
