import { Inject, Logger } from '@nestjs/common'
import { Processor, WorkerHost } from '@nestjs/bullmq'
import type { Job } from 'bullmq'
import { PrismaService } from '@ecom/database'
import { type NotificationType, type UserNotificationType, type Prisma } from '@ecom/database'
import { QUEUES, NOTIFICATION_JOBS } from '@ecom/shared'
import type { NotificationJobPayload } from '@ecom/shared'
import type { ChannelRouterService } from './channels/channel-router.service'

@Processor(QUEUES.NOTIFICATION, { concurrency: 5 })
export class NotificationProcessor extends WorkerHost {
  private readonly logger = new Logger(NotificationProcessor.name)

  constructor(
    @Inject(PrismaService) private readonly prisma: PrismaService,
    private readonly channelRouter: ChannelRouterService,
  ) {
    super()
  }

  async process(job: Job<NotificationJobPayload>) {
    try {
      if (job.name === NOTIFICATION_JOBS.SELLER_NOTIFICATION) {
        await this.processSellerNotification(job.data)
        return
      }

      if (job.name === NOTIFICATION_JOBS.USER_NOTIFICATION) {
        await this.processUserNotification(job.data)
        return
      }

      if (job.name === NOTIFICATION_JOBS.ADMIN_BROADCAST) {
        await this.processAdminBroadcast(job.data)
        return
      }

      this.logger.warn(`Unknown notification job name: ${job.name}`)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error'
      this.logger.error(`Notification job ${job.name} (${job.id}) failed: ${message}`)
      throw error
    }
  }

  private async processSellerNotification(data: NotificationJobPayload) {
    const payload = data as {
      kind: 'seller'
      shopId: string
      type: string
      title: string
      message: string
      metadata?: Record<string, unknown>
      idempotencyKey: string
    }

    const notification = await this.prisma.notification.upsert({
      where: { idempotencyKey: payload.idempotencyKey },
      create: {
        idempotencyKey: payload.idempotencyKey,
        shopId: payload.shopId,
        type: payload.type as NotificationType,
        title: payload.title,
        message: payload.message,
        ...(payload.metadata !== undefined && {
          metadata: payload.metadata as Prisma.InputJsonValue,
        }),
      },
      update: {},
    })

    await this.channelRouter.fanOut({
      notificationId: notification.id,
      notificationKind: 'seller',
      type: payload.type,
      title: payload.title,
      message: payload.message,
      ...(payload.metadata !== undefined ? { metadata: payload.metadata } : {}),
      target: { kind: 'shop', shopId: payload.shopId },
    })

    this.logger.log(`Seller notification upserted for shop ${payload.shopId}`)
  }

  private async processUserNotification(data: NotificationJobPayload) {
    const payload = data as {
      kind: 'user'
      userId: string
      type: string
      title: string
      message: string
      metadata?: Record<string, unknown>
      idempotencyKey: string
    }

    const notification = await this.prisma.userNotification.upsert({
      where: { idempotencyKey: payload.idempotencyKey },
      create: {
        idempotencyKey: payload.idempotencyKey,
        userId: payload.userId,
        type: payload.type as UserNotificationType,
        title: payload.title,
        message: payload.message,
        ...(payload.metadata !== undefined && {
          metadata: payload.metadata as Prisma.InputJsonValue,
        }),
      },
      update: {},
    })

    await this.channelRouter.fanOut({
      notificationId: notification.id,
      notificationKind: 'user',
      type: payload.type,
      title: payload.title,
      message: payload.message,
      ...(payload.metadata !== undefined ? { metadata: payload.metadata } : {}),
      target: { kind: 'user', userId: payload.userId },
    })

    this.logger.log(`User notification upserted for user ${payload.userId}`)
  }

  private async processAdminBroadcast(data: NotificationJobPayload) {
    const payload = data as {
      kind: 'admin'
      notificationId: string
      title: string
      message: string
      channel: string
      idempotencyKey: string
    }

    const BATCH = 500
    let cursor: string | undefined
    let fanOutCount = 0

    while (true) {
      const users = await this.prisma.user.findMany({
        where: { status: 'ACTIVE' },
        select: { id: true },
        take: BATCH,
        ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
        orderBy: { id: 'asc' },
      })

      if (users.length === 0) {
        break
      }

      for (const user of users) {
        const key = `broadcast:${payload.notificationId}:user:${user.id}`

        const notification = await this.prisma.userNotification.upsert({
          where: { idempotencyKey: key },
          create: {
            idempotencyKey: key,
            userId: user.id,
            type: 'SYSTEM',
            title: payload.title,
            message: payload.message,
          },
          update: {},
        })

        await this.channelRouter.fanOut({
          notificationId: notification.id,
          notificationKind: 'admin',
          type: 'SYSTEM',
          title: payload.title,
          message: payload.message,
          target: { kind: 'user', userId: user.id },
          requestedChannels: [payload.channel as 'IN_APP' | 'EMAIL' | 'PUSH' | 'SMS'],
        })

        fanOutCount++
      }

      cursor = users[users.length - 1]?.id

      if (users.length < BATCH) {
        break
      }
    }

    this.logger.log(`Admin broadcast ${payload.notificationId} fanned out to ${fanOutCount} users`)
  }
}
