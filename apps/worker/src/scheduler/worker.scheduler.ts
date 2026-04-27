import { InjectQueue } from '@nestjs/bullmq'
import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common'
import type { Queue } from 'bullmq'

import { OUTBOX_DRAIN_JOB_NAME, OUTBOX_QUEUE_NAME } from '@ecom/shared'

const EVERY_MINUTE = 60_000
const EVERY_FIVE_SECONDS = 5_000
const EVERY_FIVE_MINUTES = 5 * 60_000

@Injectable()
export class WorkerScheduler implements OnApplicationBootstrap {
  private readonly logger = new Logger(WorkerScheduler.name)

  constructor(
    @InjectQueue('order-expiration') private readonly orderExpirationQueue: Queue,
    @InjectQueue('inventory-reconciliation') private readonly inventoryReconciliationQueue: Queue,
    @InjectQueue(OUTBOX_QUEUE_NAME) private readonly outboxQueue: Queue,
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    await Promise.all([
      this.orderExpirationQueue.add(
        'expire-pending-orders',
        { batchSize: 200 },
        {
          jobId: 'recurring:order-expiration',
          repeat: { every: EVERY_MINUTE },
          removeOnComplete: 25,
          removeOnFail: 100,
        },
      ),
      this.inventoryReconciliationQueue.add(
        'reconcile-inventory',
        { batchSize: 1_000 },
        {
          jobId: 'recurring:inventory-reconciliation',
          repeat: { every: EVERY_FIVE_MINUTES },
          removeOnComplete: 10,
          removeOnFail: 50,
        },
      ),
      this.outboxQueue.add(
        OUTBOX_DRAIN_JOB_NAME,
        { batchSize: 100, maxAttempts: 10 },
        {
          jobId: 'recurring:outbox-drain',
          repeat: { every: EVERY_FIVE_SECONDS },
          removeOnComplete: 100,
          removeOnFail: 100,
        },
      ),
    ])
    this.logger.log('Recurring worker jobs scheduled')
  }
}
