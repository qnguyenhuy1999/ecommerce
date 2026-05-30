import { Module } from '@nestjs/common'
import { BullModule } from '@nestjs/bullmq'
import { DatabaseModule } from '@ecom/database'
import { QUEUES } from '@ecom/shared/constants/queues'
import { NotificationProducer } from './notification.producer'

@Module({
  imports: [DatabaseModule, BullModule.registerQueue({ name: QUEUES.NOTIFICATION })],
  providers: [NotificationProducer],
  exports: [NotificationProducer],
})
export class NotificationModule {}
