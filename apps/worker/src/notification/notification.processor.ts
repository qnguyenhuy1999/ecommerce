import { Logger } from '@nestjs/common'
import { Processor, WorkerHost } from '@nestjs/bullmq'
import type { Job } from 'bullmq'
import {
  PrismaService,
  type NotificationType,
  type UserNotificationType,
  type Prisma,
} from '@ecom/database'
import { QUEUES, NOTIFICATION_JOBS } from '@ecom/shared'
import type { NotificationJobPayload } from '@ecom/shared'

@Processor(QUEUES.NOTIFICATION, { concurrency: 5 })
export class NotificationProcessor extends WorkerHost {
  private readonly logger = new Logger(NotificationProcessor.name)

  constructor(private readonly prisma: PrismaService) {
    super()
  }

  async process(job: Job<NotificationJobPayload>) {
    try {
      switch (job.name) {
        case NOTIFICATION_JOBS.SELLER_NOTIFICATION: {
          const payload = job.data as {
            kind: 'seller'
            shopId: string
            type: string
            title: string
            message: string
            metadata?: Record<string, unknown>
          }
          await this.prisma.notification.create({
            data: {
              shopId: payload.shopId,
              type: payload.type as NotificationType,
              title: payload.title,
              message: payload.message,
              ...(payload.metadata !== undefined && {
                metadata: payload.metadata as Prisma.InputJsonValue,
              }),
            },
          })
          this.logger.log(`Seller notification created for shop ${payload.shopId}`)
          break
        }

        case NOTIFICATION_JOBS.USER_NOTIFICATION: {
          const payload = job.data as {
            kind: 'user'
            userId: string
            type: string
            title: string
            message: string
            metadata?: Record<string, unknown>
          }
          await this.prisma.userNotification.create({
            data: {
              userId: payload.userId,
              type: payload.type as UserNotificationType,
              title: payload.title,
              message: payload.message,
              ...(payload.metadata !== undefined && {
                metadata: payload.metadata as Prisma.InputJsonValue,
              }),
            },
          })
          this.logger.log(`User notification created for user ${payload.userId}`)
          break
        }

        case NOTIFICATION_JOBS.ADMIN_BROADCAST: {
          this.logger.log(`Admin broadcast not yet implemented (job ${job.id})`)
          break
        }

        default:
          this.logger.warn(`Unknown notification job name: ${job.name}`)
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error'
      this.logger.error(`Notification job ${job.name} (${job.id}) failed: ${message}`)
      throw error
    }
  }
}
