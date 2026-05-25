export const notificationStatuses = ['DRAFT', 'QUEUED', 'SENT', 'FAILED'] as const

export type NotificationStatus = (typeof notificationStatuses)[number]

export interface NotificationRecord {
  id: string
  title: string
  message: string
  channel: string
  status: NotificationStatus
  targetAll: boolean
  sentAtLabel: string
  createdAtLabel: string
}

export interface NotificationsProps {
  title?: string
  description?: string
  newLabel?: string
  sendLabel?: string
  emptyMessage?: string
  items?: NotificationRecord[]
  onNew?: () => void
  onSend?: (item: NotificationRecord) => void
}
