import type { PrismaService } from '@ecom/database'
import type { EmailService } from '@ecom/email'
import { Injectable } from '@nestjs/common'
import { join } from 'node:path'
import type { ChannelDeliveryResult, NotificationDeliveryPayload } from './types'

const TEMPLATE_PATH = join(__dirname, '..', 'templates', 'notification-email.hbs')

@Injectable()
export class EmailChannel {
  constructor(
    private readonly prisma: PrismaService,
    private readonly emailService: EmailService,
  ) {}

  async deliver(payload: NotificationDeliveryPayload): Promise<ChannelDeliveryResult> {
    const recipientEmail = await this.resolveRecipientEmail(payload)
    if (!recipientEmail) {
      return {
        channel: 'EMAIL',
        status: 'FAILED',
        error: 'Recipient email not found',
      }
    }

    try {
      await this.emailService.sendMail({
        to: recipientEmail,
        subject: payload.title,
        templatePath: TEMPLATE_PATH,
        context: {
          title: payload.title,
          message: payload.message,
          type: payload.type,
          metadata: payload.metadata,
        },
      })

      return { channel: 'EMAIL', status: 'DELIVERED' }
    } catch (err: unknown) {
      return {
        channel: 'EMAIL',
        status: 'FAILED',
        error: err instanceof Error ? err.message : 'Email delivery failed',
      }
    }
  }

  private async resolveRecipientEmail(
    payload: NotificationDeliveryPayload,
  ): Promise<string | null> {
    if (payload.target.kind === 'user') {
      const user = await this.prisma.user.findUnique({
        where: { id: payload.target.userId },
        select: { email: true },
      })
      return user?.email ?? null
    }

    const shop = await this.prisma.shop.findUnique({
      where: { id: payload.target.shopId },
      select: {
        email: true,
        seller: {
          select: {
            user: {
              select: { email: true },
            },
          },
        },
      },
    })

    return shop?.seller.user.email ?? shop?.email ?? null
  }
}
