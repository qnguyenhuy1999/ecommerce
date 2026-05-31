'use client'

import { Button } from '@ecom/core-ui/atoms/Button'
import { Trash2 } from 'lucide-react'

interface CategoryActionsProps {
  deleteLabel: string
  deleteLoadingLabel: string
  cancelLabel: string
  saveLabel: string
  saveLoadingLabel: string
  disabled: boolean
  isSaving: boolean
  isDeleting: boolean
  onDelete: () => void
  onCancel: () => void
  onSave: () => void
}

export function CategoryActions({
  deleteLabel,
  deleteLoadingLabel,
  cancelLabel,
  saveLabel,
  saveLoadingLabel,
  disabled,
  isSaving,
  isDeleting,
  onDelete,
  onCancel,
  onSave,
}: CategoryActionsProps) {
  return (
    <div className="mt-5 flex items-center justify-between gap-4">
      <Button
        type="button"
        variant="ghost"
        className="text-destructive hover:text-destructive justify-start rounded-2xl px-0"
        onClick={onDelete}
        disabled={disabled || isSaving}
        loading={isDeleting}
        aria-label={isDeleting ? deleteLoadingLabel : deleteLabel}
      >
        <Trash2 className="size-4" aria-hidden="true" />
        {isDeleting ? deleteLoadingLabel : deleteLabel}
      </Button>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button
          type="button"
          variant="outline"
          className="rounded-2xl"
          onClick={onCancel}
          disabled={disabled}
        >
          {cancelLabel}
        </Button>
        <Button
          type="button"
          className="rounded-2xl"
          onClick={onSave}
          disabled={disabled || isDeleting}
          loading={isSaving}
        >
          {isSaving ? saveLoadingLabel : saveLabel}
        </Button>
      </div>
    </div>
  )
}
