import { Injectable } from '@nestjs/common'
import { InjectQueue } from '@nestjs/bullmq'
import type { Queue } from 'bullmq'
import { QUEUES, NOTIFICATION_JOBS, defaultJobOptions } from '@ecom/shared'
import type { AdminBroadcastJobPayload } from '@ecom/shared'

@Injectable()
export class NotificationsProducer {
  constructor(@InjectQueue(QUEUES.NOTIFICATION) private readonly queue: Queue) {}

  async enqueueAdminBroadcast(payload: AdminBroadcastJobPayload): Promise<void> {
    await this.queue.add(NOTIFICATION_JOBS.ADMIN_BROADCAST, payload, defaultJobOptions())
  }
}
