import type { OnModuleInit, OnModuleDestroy } from '@nestjs/common'
import { Injectable, Logger } from '@nestjs/common'
import { InjectQueue } from '@nestjs/bullmq'
import type { Queue } from 'bullmq'
import type { PrismaService } from '@ecom/database'
import { QUEUES, NOTIFICATION_JOBS, OUTBOX_EVENTS, defaultJobOptions } from '@ecom/shared'
import type {
  ChatMessageOutboxPayload,
  SellerNotificationJobPayload,
  UserNotificationJobPayload,
} from '@ecom/shared'

const POLL_INTERVAL_MS = 5_000
const BATCH_SIZE = 50
const MAX_ATTEMPTS = 5

@Injectable()
export class OutboxPoller implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(OutboxPoller.name)
  private timer: ReturnType<typeof setInterval> | null = null

  constructor(
    private readonly prisma: PrismaService,
    @InjectQueue(QUEUES.NOTIFICATION) private readonly notificationQueue: Queue,
  ) {}

  onModuleInit() {
    this.timer = setInterval(() => void this.poll(), POLL_INTERVAL_MS)
  }

  onModuleDestroy() {
    if (this.timer) clearInterval(this.timer)
  }

  private async poll(): Promise<void> {
    const events = await this.prisma.outboxEvent.findMany({
      where: { status: 'PENDING', attempts: { lt: MAX_ATTEMPTS } },
      take: BATCH_SIZE,
      orderBy: { createdAt: 'asc' },
    })

    for (const event of events) {
      // Optimistic lock: only proceed if we increment from the exact attempts value we read.
      const locked = await this.prisma.outboxEvent.updateMany({
        where: { id: event.id, status: 'PENDING', attempts: event.attempts },
        data: { attempts: { increment: 1 } },
      })

      if (locked.count === 0) continue

      try {
        await this.handle(event.id, event.eventType, event.payload as Record<string, unknown>)
        await this.prisma.outboxEvent.update({
          where: { id: event.id },
          data: { status: 'PUBLISHED', publishedAt: new Date() },
        })
      } catch (err) {
        const lastError = err instanceof Error ? err.message : String(err)
        const newAttempts = event.attempts + 1
        await this.prisma.outboxEvent.update({
          where: { id: event.id },
          data: {
            lastError,
            ...(newAttempts >= MAX_ATTEMPTS ? { status: 'FAILED' } : {}),
          },
        })
        this.logger.error(`OutboxEvent ${event.id} (${event.eventType}) failed: ${lastError}`)
      }
    }
  }

  private async handle(
    _eventId: string,
    eventType: string,
    payload: Record<string, unknown>,
  ): Promise<void> {
    if (eventType !== OUTBOX_EVENTS.MESSAGE_CREATED) {
      this.logger.warn(`OutboxPoller: unhandled eventType "${eventType}"`)
      return
    }

    const chatPayload = payload as ChatMessageOutboxPayload
    const messageId = chatPayload.messageId
    const content = chatPayload.content ?? ''
    const metadata = {
      conversationId: chatPayload.conversationId,
      messageId,
    }

    if (chatPayload.recipientKind === 'user') {
      const jobPayload: UserNotificationJobPayload = {
        kind: 'user',
        userId: chatPayload.recipientUserId,
        type: 'NEW_MESSAGE',
        title: 'New message',
        message: content.substring(0, 100),
        idempotencyKey: `msg:user:${messageId}`,
        metadata,
      }

      await this.notificationQueue.add(
        NOTIFICATION_JOBS.USER_NOTIFICATION,
        jobPayload,
        defaultJobOptions(),
      )
      return
    }

    const jobPayload: SellerNotificationJobPayload = {
      kind: 'seller',
      shopId: chatPayload.recipientShopId,
      type: 'MESSAGE',
      title: 'New message',
      message: content.substring(0, 100),
      idempotencyKey: `msg:shop:${messageId}`,
      metadata,
    }

    await this.notificationQueue.add(
      NOTIFICATION_JOBS.SELLER_NOTIFICATION,
      jobPayload,
      defaultJobOptions(),
    )
  }
}
