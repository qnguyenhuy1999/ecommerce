import { Module } from '@nestjs/common'
import { BullModule } from '@nestjs/bullmq'
import { QUEUES } from '@ecom/shared'
import { NotificationProcessor } from './notification.processor'

@Module({
  imports: [BullModule.registerQueue({ name: QUEUES.NOTIFICATION })],
  providers: [NotificationProcessor],
})
export class NotificationProcessorModule {}
