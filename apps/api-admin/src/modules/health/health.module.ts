import { BullModule } from '@nestjs/bullmq'
import { Module } from '@nestjs/common'
import { QUEUES } from '@ecom/shared/constants/queues'
import { HealthController } from './health.controller'

@Module({
  imports: [
    BullModule.registerQueue({ name: QUEUES.NOTIFICATION }, { name: QUEUES.ORDER_PROCESSING }),
  ],
  controllers: [HealthController],
})
export class HealthModule {}
