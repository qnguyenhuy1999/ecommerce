'use client'

import { Button } from '@ecom/core-ui/atoms/Button'
import { Switch } from '@ecom/core-ui/atoms/Switch'

interface UnreadOnlyControlProps {
  unreadOnly: boolean
  onUnreadOnlyChange: ((value: boolean) => void) | undefined
}

export function UnreadOnlyControl({ unreadOnly, onUnreadOnlyChange }: UnreadOnlyControlProps) {
  return (
    <div className="mb-4 flex items-center gap-2">
      <Switch id="unread-only" checked={unreadOnly} onCheckedChange={onUnreadOnlyChange} />
      <label htmlFor="unread-only" className="text-muted-foreground cursor-pointer text-sm">
        Unread only
      </label>
    </div>
  )
}

interface MarkAllReadButtonProps {
  onMarkAllRead: () => void
}

export function MarkAllReadButton({ onMarkAllRead }: MarkAllReadButtonProps) {
  return (
    <Button variant="outline" size="sm" onClick={onMarkAllRead}>
      Mark all as read
    </Button>
  )
}

interface MarkReadButtonProps {
  notificationId: string
  onMarkRead: (id: string) => void
}

export function MarkReadButton({ notificationId, onMarkRead }: MarkReadButtonProps) {
  return (
    <Button
      variant="ghost"
      size="sm"
      className="shrink-0"
      onClick={() => onMarkRead(notificationId)}
    >
      Mark read
    </Button>
  )
}
