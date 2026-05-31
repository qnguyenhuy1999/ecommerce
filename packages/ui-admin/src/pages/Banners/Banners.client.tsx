'use client'

import { Button } from '@ecom/core-ui'
import { Plus } from 'lucide-react'
import type { BannerActionsProps, NewBannerButtonProps } from './Banners.types'

export function NewBannerButton({ label, onNew }: NewBannerButtonProps) {
  return (
    <Button type="button" onClick={() => void onNew()}>
      <Plus className="size-4" />
      {label ?? 'New banner'}
    </Button>
  )
}

export function BannerActions({
  item,
  editLabel,
  deleteLabel,
  onEdit,
  onDelete,
}: BannerActionsProps) {
  if (!onEdit && !onDelete) return null

  return (
    <div className="flex gap-2">
      {onEdit && (
        <button
          type="button"
          onClick={() => onEdit(item)}
          className="hover:bg-muted rounded px-2 py-1 text-xs"
        >
          {editLabel ?? 'Edit'}
        </button>
      )}

      {onDelete && (
        <button
          type="button"
          onClick={() => onDelete(item)}
          className="text-destructive hover:bg-destructive/10 rounded px-2 py-1 text-xs"
        >
          {deleteLabel ?? 'Delete'}
        </button>
      )}
    </div>
  )
}
