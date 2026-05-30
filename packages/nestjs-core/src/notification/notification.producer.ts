import { Injectable, Inject } from '@nestjs/common'
import type { Queue } from 'bullmq'
import {
  NOTIFICATION_JOBS,
  defaultJobOptions,
  type UserNotificationJobPayload,
  type SellerNotificationJobPayload,
  type AdminBroadcastJobPayload,
} from '@ecom/shared/constants/notification-jobs'
import { QUEUES } from '@ecom/shared/constants/queues'

@Injectable()
export class NotificationProducer {
  constructor(@Inject('BullQueue_' + QUEUES.NOTIFICATION) private readonly queue: Queue) {}

  async enqueueUser(payload: UserNotificationJobPayload): Promise<void> {
    await this.queue.add(NOTIFICATION_JOBS.USER_NOTIFICATION, payload, defaultJobOptions())
  }

  async enqueueSeller(payload: SellerNotificationJobPayload): Promise<void> {
    await this.queue.add(NOTIFICATION_JOBS.SELLER_NOTIFICATION, payload, defaultJobOptions())
  }

  async enqueueAdminBroadcast(payload: AdminBroadcastJobPayload): Promise<void> {
    await this.queue.add(NOTIFICATION_JOBS.ADMIN_BROADCAST, payload, defaultJobOptions())
  }
}
