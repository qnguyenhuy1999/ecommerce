import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';

// TODO: implement order expiration processor
// Queue: order-expiration — cancels unpaid orders after RESERVATION_TTL_MINUTES

@Processor('order-expiration')
export class OrderExpirationProcessor extends WorkerHost {
  // eslint-disable-next-line @typescript-eslint/require-await
  async process(job: Job): Promise<void> {
    // TODO: find PENDING_PAYMENT orders past expiry
    // TODO: restore inventory reservations
    // TODO: emit ORDER_EXPIRED event
    console.info('[OrderExpirationProcessor] Processing job', job.id);
  }
}
