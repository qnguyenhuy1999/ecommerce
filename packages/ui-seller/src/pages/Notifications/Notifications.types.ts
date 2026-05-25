export interface NotificationRow {
  id: string
  type: string
  title: string
  message: string
  isRead: boolean
  createdAtLabel: string
}

export interface NotificationsProps {
  title?: string
  description?: string
  rows?: NotificationRow[]
  loading?: boolean
  unreadOnly?: boolean
  onUnreadOnlyChange?: (v: boolean) => void
  onMarkRead?: (id: string) => void
  onMarkAllRead?: () => void
  emptyMessage?: string
}
