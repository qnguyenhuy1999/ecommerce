'use client'

import { Button } from '@ecom/core-ui/atoms/Button'

interface MarkAllReadButtonProps {
  label: string
  onMarkAllRead: (() => void) | undefined
}

export function MarkAllReadButton({ label, onMarkAllRead }: MarkAllReadButtonProps) {
  return (
    <Button type="button" variant="outline" size="sm" onClick={onMarkAllRead}>
      {label}
    </Button>
  )
}

interface MarkReadButtonProps {
  notificationId: string
  label: string
  onMarkRead: ((id: string) => void) | undefined
}

export function MarkReadButton({ notificationId, label, onMarkRead }: MarkReadButtonProps) {
  return (
    <Button type="button" variant="ghost" size="sm" onClick={() => onMarkRead?.(notificationId)}>
      {label}
    </Button>
  )
}
