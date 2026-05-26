'use client'

import { Button, Typography } from '@ecom/core-ui'
import { StorefrontLayout } from '../../layouts'
import type { NotificationRecord, NotificationsProps } from './Notifications.types'

function NotificationCard({
  notification,
  markReadLabel,
  onMarkRead,
}: {
  notification: NotificationRecord
  markReadLabel: string
  onMarkRead?: (id: string) => void
}) {
  return (
    <div
      className={`rounded-xl border p-4 transition-colors ${notification.isRead ? 'opacity-60' : 'border-primary/30 bg-primary/5'}`}
    >
      <div className="flex items-start justify-between gap-2">
        <Typography variant="label">{notification.title}</Typography>
        {!notification.isRead && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onMarkRead?.(notification.id)}
          >
            {markReadLabel}
          </Button>
        )}
      </div>
      <Typography variant="body-sm" className="text-muted-foreground mt-1">
        {notification.message}
      </Typography>
      <Typography variant="caption" className="text-muted-foreground mt-2">
        {notification.createdAtLabel}
      </Typography>
    </div>
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
  if (loading) {
    return (
      <StorefrontLayout>
        <StorefrontLayout.Content>
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-muted h-20 animate-pulse rounded-xl" />
            ))}
          </div>
        </StorefrontLayout.Content>
      </StorefrontLayout>
    )
  }

  return (
    <StorefrontLayout>
      <StorefrontLayout.Content>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Typography variant="h1">Notifications</Typography>
            {notifications.some((n) => !n.isRead) && (
              <Button type="button" variant="outline" size="sm" onClick={onMarkAllRead}>
                {markAllReadLabel}
              </Button>
            )}
          </div>

          {notifications.length === 0 ? (
            <Typography variant="muted">No notifications yet.</Typography>
          ) : (
            <div className="space-y-3">
              {notifications.map((notification) => (
                <NotificationCard
                  key={notification.id}
                  notification={notification}
                  markReadLabel={markReadLabel}
                  {...(onMarkRead !== undefined ? { onMarkRead } : {})}
                />
              ))}
            </div>
          )}
        </div>
      </StorefrontLayout.Content>
    </StorefrontLayout>
  )
}
