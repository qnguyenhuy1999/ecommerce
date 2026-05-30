import { InjectQueue } from '@nestjs/bullmq'
import { Controller, Get, UseGuards } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import type { Queue } from 'bullmq'
import { QUEUES } from '@ecom/shared/constants/queues'
import { AdminAuthGuard } from '../auth/guards/admin-auth.guard'

@ApiTags('Admin/Health')
@Controller('health')
@UseGuards(AdminAuthGuard)
export class HealthController {
  constructor(
    @InjectQueue(QUEUES.NOTIFICATION)
    private readonly notificationQueue: Queue,
    @InjectQueue(QUEUES.ORDER_PROCESSING)
    private readonly orderProcessingQueue: Queue,
  ) {}

  @Get('queues')
  async getQueueHealth() {
    const [notification, orderProcessing] = await Promise.all([
      this.notificationQueue.getJobCounts('failed', 'waiting', 'active'),
      this.orderProcessingQueue.getJobCounts('failed', 'waiting', 'active'),
    ])

    return {
      queues: {
        [QUEUES.NOTIFICATION]: notification,
        [QUEUES.ORDER_PROCESSING]: orderProcessing,
      },
    }
  }
}
