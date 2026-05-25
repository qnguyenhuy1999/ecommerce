import { PrismaService, type Prisma, type UserNotificationType } from '@ecom/database'
import { PAGINATION_DEFAULTS } from '@ecom/shared/pagination/core'
import { buildOffsetResponse, offsetPaginate } from '@ecom/shared/pagination/prisma'
import { Injectable } from '@nestjs/common'
import type { NotificationQueryDto } from './dto/notification.dto'

@Injectable()
export class NotificationsService {
  constructor(private readonly prisma: PrismaService) {}

  async list(userId: string, query: NotificationQueryDto) {
    const { page = 1, limit = PAGINATION_DEFAULTS.DEFAULT_LIMIT, unreadOnly, type } = query

    const where: Prisma.UserNotificationWhereInput = { userId }
    if (unreadOnly) where.isRead = false
    if (type !== undefined) where.type = type as UserNotificationType

    const { items, total } = await offsetPaginate(this.prisma.userNotification, {
      page,
      limit,
      where,
      orderBy: { createdAt: 'desc' },
    })

    return buildOffsetResponse(items, page, limit, total)
  }

  async getUnreadCount(userId: string) {
    const count = await this.prisma.userNotification.count({
      where: { userId, isRead: false },
    })
    return { count }
  }

  async markAsRead(userId: string, notificationId: string) {
    await this.prisma.userNotification.updateMany({
      where: { id: notificationId, userId },
      data: { isRead: true },
    })
  }

  async markAllAsRead(userId: string) {
    const result = await this.prisma.userNotification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    })
    return { updated: result.count }
  }
}
