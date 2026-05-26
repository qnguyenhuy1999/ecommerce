export interface NotificationRecord {
  id: string
  title: string
  message: string
  isRead: boolean
  createdAtLabel: string
}

export interface NotificationsProps {
  notifications?: NotificationRecord[]
  loading?: boolean
  markAllReadLabel?: string
  markReadLabel?: string
  onMarkAllRead?: () => void
  onMarkRead?: (id: string) => void
}
