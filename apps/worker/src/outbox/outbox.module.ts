import { Module } from '@nestjs/common'
import { BullModule } from '@nestjs/bullmq'
import { QUEUES } from '@ecom/shared/constants/queues'
import { OutboxPoller } from './outbox.poller'

@Module({
  imports: [BullModule.registerQueue({ name: QUEUES.NOTIFICATION })],
  providers: [OutboxPoller],
})
export class OutboxModule {}
