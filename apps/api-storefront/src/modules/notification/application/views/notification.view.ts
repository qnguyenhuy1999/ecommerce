import type { NotificationType } from '@prisma/client'

export interface NotificationView {
  id: string
  type: NotificationType
  title: string
  body: string
  data: Record<string, unknown> | null
  isRead: boolean
  createdAt: string
}

export interface NotificationListPage {
  data: NotificationView[]
  page: number
  limit: number
  total: number
  totalPages: number
  unreadCount: number
}

export interface MarkNotificationReadView {
  id: string
  isRead: boolean
}
