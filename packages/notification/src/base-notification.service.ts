import { PrismaService } from '@ecom/database'
import { PAGINATION_DEFAULTS } from '@ecom/shared/pagination/core'
import { buildOffsetResponse, offsetPaginate } from '@ecom/shared/pagination/prisma'
import { Inject } from '@nestjs/common'

type NotificationModel = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  findMany: (args: any) => Promise<any[]>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  count: (args: any) => Promise<number>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  updateMany: (args: any) => Promise<{ count: number }>
}

export interface NotificationQueryParams {
  page?: number
  limit?: number
  unreadOnly?: boolean
  type?: string
}

export abstract class BaseNotificationService {
  constructor(@Inject(PrismaService) protected readonly prisma: PrismaService) {}

  /**
   * Return the Prisma model delegate for this service.
   * e.g. `return this.prisma.userNotification` or `return this.prisma.notification`
   */
  protected abstract getModel(): NotificationModel

  /**
   * Return the subject key used in where-clauses.
   * e.g. `'userId'` or `'shopId'`
   */
  protected abstract getSubjectKey(): 'userId' | 'shopId'

  async list(subjectId: string, query: NotificationQueryParams) {
    const { page = 1, limit = PAGINATION_DEFAULTS.DEFAULT_LIMIT, unreadOnly, type } = query

    const where: Record<string, unknown> = { [this.getSubjectKey()]: subjectId }
    if (unreadOnly) where['isRead'] = false
    if (type !== undefined) where['type'] = type

    const { items, total } = await offsetPaginate(this.getModel(), {
      page,
      limit,
      where,
      orderBy: { createdAt: 'desc' },
    })

    return buildOffsetResponse(items, page, limit, total)
  }

  async getUnreadCount(subjectId: string) {
    const count = await this.getModel().count({
      where: { [this.getSubjectKey()]: subjectId, isRead: false },
    })
    return { count }
  }

  async markAsRead(subjectId: string, notificationId: string) {
    await this.getModel().updateMany({
      where: { id: notificationId, [this.getSubjectKey()]: subjectId },
      data: { isRead: true },
    })
  }

  async markAllAsRead(subjectId: string) {
    const result = await this.getModel().updateMany({
      where: { [this.getSubjectKey()]: subjectId, isRead: false },
      data: { isRead: true },
    })
    return { updated: result.count }
  }
}
