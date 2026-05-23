import { Injectable } from '@nestjs/common'
import { InjectQueue } from '@nestjs/bullmq'
import type { Queue } from 'bullmq'
import { QUEUES, NOTIFICATION_JOBS, type UserNotificationJobPayload } from '@ecom/shared'

@Injectable()
export class NotificationsProducer {
  constructor(@InjectQueue(QUEUES.NOTIFICATION) private readonly queue: Queue) {}

  async enqueue(payload: UserNotificationJobPayload): Promise<void> {
    await this.queue.add(NOTIFICATION_JOBS.USER_NOTIFICATION, payload)
  }
}
