// TODO: implement order expiration processor
// Queue: order-expiration — cancels unpaid orders after RESERVATION_TTL_MINUTES
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';

@Processor('order-expiration')
export class OrderExpirationProcessor extends WorkerHost {
  async process(job: Job): Promise<void> {
    // TODO: find PENDING_PAYMENT orders past expiry
    // TODO: restore inventory reservations
    // TODO: emit ORDER_EXPIRED event
  }
}
