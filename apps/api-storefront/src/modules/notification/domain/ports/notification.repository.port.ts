import type { NotificationType, Prisma } from '@prisma/client'

import type {
  MarkNotificationReadView,
  NotificationListPage,
  NotificationView,
} from '../../application/views/notification.view'

export const NOTIFICATION_REPOSITORY = Symbol('NOTIFICATION_REPOSITORY')

export interface ListNotificationsInput {
  userId: string
  page: number
  limit: number
  isRead?: boolean
}

export interface CreateNotificationInput {
  userId: string
  type: NotificationType
  title: string
  body: string
  data?: Record<string, unknown> | null
  /**
   * Optional Prisma transaction client so callers can atomically create the
   * notification alongside other state changes (e.g. payment marking the order
   * paid).
   */
  tx?: Prisma.TransactionClient
}

export interface MarkReadInput {
  notificationId: string
  userId: string
}

export interface INotificationRepository {
  list(input: ListNotificationsInput): Promise<NotificationListPage>
  findById(id: string): Promise<NotificationView | null>
  create(input: CreateNotificationInput): Promise<NotificationView>
  markRead(input: MarkReadInput): Promise<MarkNotificationReadView>
}
