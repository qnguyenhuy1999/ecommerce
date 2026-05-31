import { Badge } from '@ecom/core-ui/atoms/Badge'
import { Typography } from '@ecom/core-ui/atoms/Typography'
import { Card, CardContent } from '@ecom/core-ui/molecules/Card'
import { Bell } from 'lucide-react'
import { PageHeader } from '../../atoms/PageHeader'
import { MarkAllReadButton, MarkReadButton, UnreadOnlyControl } from './Notifications.client'
import { notificationsDefaultProps } from './Notifications.fixtures'
import type { NotificationRow, NotificationsProps } from './Notifications.types'

interface NotificationsLoadingProps {
  message: string
}

function NotificationsLoading({ message }: NotificationsLoadingProps) {
  return (
    <div className="text-muted-foreground py-12 text-center text-sm" role="status">
      {message}
    </div>
  )
}

interface NotificationsEmptyProps {
  message: string
}

function NotificationsEmpty({ message }: NotificationsEmptyProps) {
  return (
    <div className="text-muted-foreground flex flex-col items-center gap-3 py-12" role="status">
      <Bell className="size-8 opacity-30" aria-hidden />
      <span className="text-sm">{message}</span>
    </div>
  )
}

interface NotificationCardProps {
  row: NotificationRow
  onMarkRead: ((id: string) => void) | undefined
}

function NotificationCard({ row, onMarkRead }: NotificationCardProps) {
  return (
    <Card className={row.isRead ? 'border-border bg-card' : 'border-primary/30 bg-primary/5'}>
      <CardContent className="flex items-start justify-between gap-4 pt-4">
        <div className="min-w-0 flex-1 space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <Typography variant="label" className="text-foreground">
              {row.title}
            </Typography>
            <Badge variant="secondary" className="rounded-full text-xs">
              {row.type}
            </Badge>
          </div>
          <Typography variant="body-sm" className="text-muted-foreground">
            {row.message}
          </Typography>
          <Typography variant="caption" className="text-muted-foreground">
            {row.createdAtLabel}
          </Typography>
        </div>
        {!row.isRead && onMarkRead ? (
          <MarkReadButton notificationId={row.id} onMarkRead={onMarkRead} />
        ) : null}
      </CardContent>
    </Card>
  )
}

export function Notifications({
  title = notificationsDefaultProps.title,
  description = notificationsDefaultProps.description,
  rows = notificationsDefaultProps.rows,
  loading = notificationsDefaultProps.loading,
  unreadOnly = notificationsDefaultProps.unreadOnly,
  onUnreadOnlyChange,
  onMarkRead,
  onMarkAllRead,
  emptyMessage = notificationsDefaultProps.emptyMessage,
}: NotificationsProps) {
  const visibleRows = unreadOnly ? rows.filter((row) => !row.isRead) : rows
  const hasUnread = rows.some((row) => !row.isRead)

  return (
    <section className="p-6" aria-labelledby="seller-notifications-title">
      <PageHeader
        title={title}
        description={description}
        actions={
          hasUnread && onMarkAllRead ? (
            <MarkAllReadButton onMarkAllRead={onMarkAllRead} />
          ) : undefined
        }
      />

      <UnreadOnlyControl unreadOnly={unreadOnly} onUnreadOnlyChange={onUnreadOnlyChange} />

      {loading ? (
        <NotificationsLoading message="Loading..." />
      ) : visibleRows.length === 0 ? (
        <NotificationsEmpty message={emptyMessage} />
      ) : (
        <div className="space-y-3">
          {visibleRows.map((row) => (
            <NotificationCard key={row.id} row={row} onMarkRead={onMarkRead} />
          ))}
        </div>
      )}
    </section>
  )
}
