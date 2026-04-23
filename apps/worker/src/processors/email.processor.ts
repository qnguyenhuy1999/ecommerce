import { Processor, WorkerHost } from '@nestjs/bullmq'
import { Job } from 'bullmq'

// TODO(@platform, 2026-04-23): Implement email processor (welcome, order confirmation, refund notifications, seller approval).
// Queue: email
@Processor('email')
export class EmailProcessor extends WorkerHost {
  process(job: Job): Promise<void> {
    switch (job.name) {
      // TODO(@platform, 2026-04-23): Handle 'welcome' job (send welcome email).
      // TODO(@platform, 2026-04-23): Handle 'order-confirmation' job (send order confirmation email).
      // TODO(@platform, 2026-04-23): Handle 'seller-approved' job (send seller approval email).
      default:
        // eslint-disable-next-line no-console -- Useful visibility for unexpected jobs during development.
        console.info(`[EmailProcessor] Unknown job: ${job.name}`)
    }

    return Promise.resolve()
  }
}
