import { Module } from '@nestjs/common'
import { BullModule } from '@nestjs/bullmq'
import { CheckoutProcessor } from './checkout.processor'
import { QUEUES } from '@ecom/shared'

@Module({
  imports: [
    BullModule.registerQueue({ name: QUEUES.ORDER_PROCESSING }),
  ],
  providers: [CheckoutProcessor],
})
export class CheckoutProcessorModule {}
