import { Injectable } from '@nestjs/common'
import { InjectQueue } from '@nestjs/bullmq'
import type { Queue } from 'bullmq'
import { QUEUES, NOTIFICATION_JOBS, defaultJobOptions } from '@ecom/shared'
import type { SellerNotificationJobPayload } from '@ecom/shared'

@Injectable()
export class NotificationProducer {
  constructor(@InjectQueue(QUEUES.NOTIFICATION) private readonly queue: Queue) {}

  async enqueueSellerNotification(payload: SellerNotificationJobPayload): Promise<void> {
    await this.queue.add(NOTIFICATION_JOBS.SELLER_NOTIFICATION, payload, defaultJobOptions())
  }
}
