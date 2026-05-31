import { Typography } from '@ecom/core-ui/atoms/Typography'
import { StorefrontLayout } from '../../layouts'
import { MarkAllReadButton, MarkReadButton } from './Notifications.client'
import type { NotificationRecord, NotificationsProps } from './Notifications.types'

interface NotificationCardProps {
  notification: NotificationRecord
  markReadLabel: string
  onMarkRead: ((id: string) => void) | undefined
}

function NotificationCard({ notification, markReadLabel, onMarkRead }: NotificationCardProps) {
  return (
    <article
      className={`rounded-xl border p-4 transition-colors ${notification.isRead ? 'opacity-60' : 'border-primary/30 bg-primary/5'}`}
    >
      <div className="flex items-start justify-between gap-2">
        <Typography variant="label">{notification.title}</Typography>
        {!notification.isRead && (
          <MarkReadButton
            notificationId={notification.id}
            label={markReadLabel}
            onMarkRead={onMarkRead}
          />
        )}
      </div>
      <Typography variant="body-sm" className="text-muted-foreground mt-1">
        {notification.message}
      </Typography>
      <Typography variant="caption" className="text-muted-foreground mt-2">
        {notification.createdAtLabel}
      </Typography>
    </article>
  )
}

interface NotificationsLoadingProps {
  itemCount: number
}

function NotificationsLoading({ itemCount }: NotificationsLoadingProps) {
  return (
    <StorefrontLayout>
      <StorefrontLayout.Content>
        <section className="space-y-3" aria-busy="true" aria-label="Loading notifications">
          <span className="sr-only" role="status">
            Loading notifications
          </span>
          {Array.from({ length: itemCount }).map((_, i) => (
            <div key={i} className="bg-muted h-20 animate-pulse rounded-xl" />
          ))}
        </section>
      </StorefrontLayout.Content>
    </StorefrontLayout>
  )
}

interface NotificationsEmptyProps {
  message: string
}

function NotificationsEmpty({ message }: NotificationsEmptyProps) {
  return (
    <Typography variant="muted" role="status">
      {message}
    </Typography>
  )
}

export function Notifications({
  notifications = [],
  loading = false,
  markAllReadLabel = 'Mark all read',
  markReadLabel = 'Mark read',
  onMarkAllRead,
  onMarkRead,
}: NotificationsProps) {
  const hasUnreadNotifications = notifications.some((notification) => !notification.isRead)

  if (loading) {
    return <NotificationsLoading itemCount={4} />
  }

  return (
    <StorefrontLayout>
      <StorefrontLayout.Content>
        <section className="space-y-4" aria-labelledby="storefront-notifications-title">
          <header className="flex items-center justify-between">
            <Typography id="storefront-notifications-title" variant="h1">
              Notifications
            </Typography>
            {hasUnreadNotifications && (
              <MarkAllReadButton label={markAllReadLabel} onMarkAllRead={onMarkAllRead} />
            )}
          </header>

          {notifications.length === 0 ? (
            <NotificationsEmpty message="No notifications yet." />
          ) : (
            <div className="space-y-3">
              {notifications.map((notification) => (
                <NotificationCard
                  key={notification.id}
                  notification={notification}
                  markReadLabel={markReadLabel}
                  onMarkRead={onMarkRead}
                />
              ))}
            </div>
          )}
        </section>
      </StorefrontLayout.Content>
    </StorefrontLayout>
  )
}
