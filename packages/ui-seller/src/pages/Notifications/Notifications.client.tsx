'use client'

import { Badge, Button, Card, CardContent, Switch, Typography } from '@ecom/core-ui'
import { Bell } from 'lucide-react'
import { useMemo } from 'react'
import { useControllableState } from '../../hooks'
import { PageHeader } from '../../atoms/PageHeader'
import { notificationsDefaultProps } from './Notifications.fixtures'
import type { NotificationsProps } from './Notifications.types'

export function NotificationsClient({
  title = notificationsDefaultProps.title,
  description = notificationsDefaultProps.description,
  rows = notificationsDefaultProps.rows,
  loading = notificationsDefaultProps.loading,
  unreadOnly: unreadOnlyProp,
  onUnreadOnlyChange,
  onMarkRead,
  onMarkAllRead,
  emptyMessage = notificationsDefaultProps.emptyMessage,
}: NotificationsProps) {
  const controllableStateOptions = {
    defaultValue: false,
    ...(unreadOnlyProp !== undefined ? { value: unreadOnlyProp } : {}),
    ...(onUnreadOnlyChange ? { onChange: onUnreadOnlyChange } : {}),
  }
  const [unreadOnly, setUnreadOnly] = useControllableState<boolean>(controllableStateOptions)

  const filtered = useMemo(
    () => (unreadOnly ? rows.filter((r) => !r.isRead) : rows),
    [rows, unreadOnly],
  )

  const hasUnread = rows.some((r) => !r.isRead)

  return (
    <div className="p-6">
      <PageHeader
        title={title}
        description={description}
        actions={
          hasUnread && onMarkAllRead ? (
            <Button variant="outline" size="sm" onClick={onMarkAllRead}>
              Mark all as read
            </Button>
          ) : undefined
        }
      />

      <div className="mb-4 flex items-center gap-2">
        <Switch id="unread-only" checked={unreadOnly} onCheckedChange={setUnreadOnly} />
        <label htmlFor="unread-only" className="text-muted-foreground cursor-pointer text-sm">
          Unread only
        </label>
      </div>

      {loading ? (
        <div className="text-muted-foreground py-12 text-center text-sm">Loading...</div>
      ) : filtered.length === 0 ? (
        <div className="text-muted-foreground flex flex-col items-center gap-3 py-12">
          <Bell className="size-8 opacity-30" />
          <span className="text-sm">{emptyMessage}</span>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((row) => (
            <Card
              key={row.id}
              className={row.isRead ? 'border-border bg-card' : 'border-primary/30 bg-primary/5'}
            >
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
                  <Button
                    variant="ghost"
                    size="sm"
                    className="shrink-0"
                    onClick={() => onMarkRead(row.id)}
                  >
                    Mark read
                  </Button>
                ) : null}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
