import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';

// TODO: implement email processor
// Queue: email — handles: welcome email, order confirmation, refund notification, seller approval

@Processor('email')
export class EmailProcessor extends WorkerHost {
  process(job: Job): void {
    switch (job.name) {
      // TODO: case 'welcome': send welcome email
      // TODO: case 'order-confirmation': send order confirmation
      // TODO: case 'seller-approved': send approval email
      default:
        console.info(`[EmailProcessor] Unknown job: ${job.name}`);
    }
  }
}
