import type { NotificationRow } from './Notifications.types'

interface NotificationsDefaultProps {
  title: string
  description: string
  rows: NotificationRow[]
  loading: boolean
  unreadOnly: boolean
  onUnreadOnlyChange: (value: boolean) => void
  onMarkRead: (id: string) => void
  onMarkAllRead: () => void
  emptyMessage: string
}

export const notificationsDefaultProps = {
  title: 'Notifications',
  description: 'Stay up to date with your store activity.',
  rows: [
    {
      id: '1',
      type: 'ORDER',
      title: 'New order received',
      message: 'Order #1042 has been placed and is awaiting confirmation.',
      isRead: false,
      createdAtLabel: '2 minutes ago',
    },
    {
      id: '2',
      type: 'REVIEW',
      title: 'New product review',
      message: 'A customer left a 5-star review on "Premium Wireless Headphones".',
      isRead: false,
      createdAtLabel: '1 hour ago',
    },
    {
      id: '3',
      type: 'SYSTEM',
      title: 'Shop profile updated',
      message: 'Your shop profile changes have been saved successfully.',
      isRead: true,
      createdAtLabel: 'Yesterday at 3:45 PM',
    },
    {
      id: '4',
      type: 'PROMOTION',
      title: 'Voucher campaign ended',
      message: 'The "Summer Sale" voucher campaign has ended. View the report.',
      isRead: true,
      createdAtLabel: '2 days ago',
    },
  ],
  loading: false,
  unreadOnly: false,
  onUnreadOnlyChange: () => {},
  onMarkRead: (_id: string) => {},
  onMarkAllRead: () => {},
  emptyMessage: 'No notifications to show.',
} satisfies NotificationsDefaultProps
