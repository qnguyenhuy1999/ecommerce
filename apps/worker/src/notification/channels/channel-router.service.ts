import type { PrismaService} from '@ecom/database';
import { type NotificationChannel, type UserNotificationType } from '@ecom/database'
import { Injectable, Logger } from '@nestjs/common'
import type { EmailChannel } from './email.channel'
import type { InAppChannel } from './in-app.channel'
import type { PushChannel } from './push.channel'
import type { ChannelDeliveryResult, NotificationDeliveryPayload } from './types'

@Injectable()
export class ChannelRouterService {
  private readonly logger = new Logger(ChannelRouterService.name)

  constructor(
    private readonly prisma: PrismaService,
    private readonly inAppChannel: InAppChannel,
    private readonly emailChannel: EmailChannel,
    private readonly pushChannel: PushChannel,
  ) {}

  async fanOut(payload: NotificationDeliveryPayload): Promise<void> {
    const deliveryPlan = await this.resolveDeliveryPlan(payload)

    for (const item of deliveryPlan) {
      const result =
        item.reason !== undefined
          ? { channel: item.channel, status: 'SKIPPED' as const, error: item.reason }
          : await this.deliver(payload, item.channel)

      await this.recordDelivery(
        payload.notificationId,
        payload.notificationKind,
        result.channel,
        result.status,
        result.error,
      )
    }
  }

  private async resolveDeliveryPlan(
    payload: NotificationDeliveryPayload,
  ): Promise<Array<{ channel: NotificationChannel; reason?: string }>> {
    if (payload.target.kind !== 'user') {
      const requestedChannels = payload.requestedChannels ?? ['IN_APP']
      return dedupeChannels(requestedChannels).map((channel) => ({ channel }))
    }

    const preferences = await this.prisma.userNotificationPreference.findMany({
      where: {
        userId: payload.target.userId,
        type: payload.type as UserNotificationType,
      },
      select: { channel: true, enabled: true },
    })

    const enabledChannels =
      preferences.length === 0
        ? (['IN_APP'] as NotificationChannel[])
        : preferences
            .filter((preference) => preference.enabled)
            .map((preference) => preference.channel)

    if (!payload.requestedChannels || payload.requestedChannels.length === 0) {
      return dedupeChannels(enabledChannels).map((channel) => ({ channel }))
    }

    const enabledChannelSet = new Set<NotificationChannel>(enabledChannels)
    return dedupeChannels(payload.requestedChannels).map((channel) =>
      enabledChannelSet.has(channel)
        ? { channel }
        : { channel, reason: 'Channel disabled by user preference' },
    )
  }

  private async deliver(
    payload: NotificationDeliveryPayload,
    channel: NotificationChannel,
  ): Promise<ChannelDeliveryResult> {
    switch (channel) {
      case 'IN_APP':
        return this.inAppChannel.deliver(payload)
      case 'EMAIL':
        return this.emailChannel.deliver(payload)
      case 'PUSH':
        return this.pushChannel.deliver(payload)
      case 'SMS':
        return { channel: 'SMS', status: 'SKIPPED', error: 'SMS channel not implemented' }
      default:
        return { channel, status: 'SKIPPED', error: 'Unsupported channel' }
    }
  }

  private async recordDelivery(
    notificationId: string,
    notificationKind: string,
    channel: NotificationChannel,
    status: 'DELIVERED' | 'FAILED' | 'SKIPPED',
    error?: string,
  ): Promise<void> {
    try {
      await this.prisma.deliveryStatus.create({
        data: {
          notificationId,
          notificationKind,
          channel,
          status,
          attempts: 1,
          ...(error ? { lastError: error } : {}),
          ...(status === 'DELIVERED' ? { deliveredAt: new Date() } : {}),
        },
      })
    } catch (err: unknown) {
      this.logger.warn(
        `DeliveryStatus record failed for ${notificationId}: ${err instanceof Error ? err.message : String(err)}`,
      )
    }
  }
}

function dedupeChannels(channels: NotificationChannel[]): NotificationChannel[] {
  return [...new Set(channels)]
}
