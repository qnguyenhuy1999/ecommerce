'use client'

import {
  Badge,
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  Label,
  Separator,
  Textarea,
  Typography,
} from '@ecom/core-ui'
import { X } from 'lucide-react'
import { productApprovalStatusToneClassNames } from './ProductApproval.constants'
import type { PendingAction, ProductApprovalItem } from './ProductApproval.types'

const productApprovalBadgeTones = {
  PENDING: 'pending',
  REPORTED: 'reported',
  APPROVED: 'approved',
  REJECTED: 'rejected',
} as const

export function ReasonTags({
  item,
  emptyLabel = '—',
  tone = 'status',
}: {
  item: ProductApprovalItem
  emptyLabel?: string
  tone?: 'status' | 'neutral'
}) {
  if (item.reasonTags.length === 0) {
    return (
      <Typography variant="body-sm" className="text-muted-foreground">
        {emptyLabel}
      </Typography>
    )
  }

  return (
    <>
      {item.reasonTags.map((tag) => (
        <Badge
          key={tag.id}
          variant={tone === 'neutral' ? 'outline' : undefined}
          tone={tone === 'neutral' ? undefined : productApprovalBadgeTones[item.status]}
          size="sm"
          className={tone === 'neutral' ? 'border-border text-foreground' : undefined}
        >
          {tag.label}
        </Badge>
      ))}
    </>
  )
}

export function ProductApprovalModal({
  open,
  action,
  ids,
  reason,
  reasonLabel,
  reasonPlaceholder,
  reasonHint,
  title,
  description,
  rejectLabel,
  approveLabel,
  submitting,
  error,
  onReasonChange,
  onClose,
  onConfirm,
}: {
  open: boolean
  action: PendingAction
  ids: string[]
  reason: string
  reasonLabel: string
  reasonPlaceholder: string
  reasonHint: string
  title: string
  description: string
  rejectLabel: string
  approveLabel: string
  submitting: boolean
  error: string
  onReasonChange: (value: string) => void
  onClose: () => void
  onConfirm: () => void
}) {
  if (!open) {
    return null
  }

  return (
    <Dialog open={open} onOpenChange={(nextOpen: boolean) => !nextOpen && onClose()}>
      <DialogContent
        showCloseButton={false}
        className="border-border bg-background max-w-lg gap-0 rounded-3xl border p-0 shadow-2xl"
      >
        <DialogHeader className="relative space-y-1 px-6 pt-6 text-left">
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label="Close dialog"
            onClick={onClose}
            className="absolute top-0 right-4"
          >
            <X className="size-4" />
          </Button>
          <DialogTitle id="product-approval-dialog-title" className="text-lg font-semibold">
            {title}
          </DialogTitle>
          <DialogDescription
            id="product-approval-dialog-description"
            className="text-muted-foreground text-sm"
          >
            {description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2 px-6 py-5">
          <Label htmlFor="product-approval-reason" className="text-sm font-medium">
            {reasonLabel} <span className="text-destructive">*</span>
          </Label>
          <Textarea
            id="product-approval-reason"
            required
            aria-invalid={error ? 'true' : 'false'}
            value={reason}
            onChange={(event) => onReasonChange(event.target.value)}
            placeholder={reasonPlaceholder}
            className="min-h-28 rounded-2xl"
          />
          <Typography variant="caption" className="text-muted-foreground">
            {reasonHint}
          </Typography>
          {error ? (
            <Typography role="alert" variant="caption" className="text-destructive">
              {error}
            </Typography>
          ) : null}
        </div>

        <div className="flex items-center justify-between gap-4 border-t px-6 py-4">
          <Typography variant="caption" className="text-muted-foreground">
            {ids.length} listing{ids.length === 1 ? '' : 's'} selected
          </Typography>
          <div className="flex items-center justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="button"
              variant={action === 'approve' ? 'default' : 'destructive'}
              loading={submitting}
              onClick={onConfirm}
            >
              {action === 'approve' ? approveLabel : rejectLabel}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export function ProductApprovalDetailSheet({ item }: { item: ProductApprovalItem | null }) {
  if (!item) {
    return null
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-2 gap-2">
        {item.images.map((image) => (
          <div key={image.id} className="bg-muted aspect-square overflow-hidden rounded-xl">
            <img src={image.src} alt={image.alt} className="h-full w-full object-cover" />
          </div>
        ))}
      </div>

      <div className="border-border/60 bg-muted/30 rounded-xl border px-4 py-3">
        <div className="flex items-start justify-between gap-3">
          <Typography as="p" variant="label" className="text-foreground leading-snug font-semibold">
            {item.title}
          </Typography>
          <Typography as="span" variant="label" className="text-primary shrink-0 font-semibold">
            {item.priceLabel}
          </Typography>
        </div>
        <Separator className="my-3" />
        <div className="text-muted-foreground flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
          <span>{item.stockLabel}</span>
          <span>·</span>
          <span>{item.soldLabel}</span>
          <span>·</span>
          <span>{item.ratingLabel}</span>
        </div>
      </div>

      <div className="space-y-2">
        <Typography as="h3" variant="label" className="text-foreground font-semibold">
          Policy tags
        </Typography>
        <div className="mt-2">
          <ReasonTags item={item} emptyLabel="No policy tags" tone="neutral" />
        </div>
      </div>
    </div>
  )
}

export function ProductApprovalDetailSheetFooter({
  item,
  approveLabel,
  rejectLabel,
  onApprove,
  onReject,
}: {
  item: ProductApprovalItem
  approveLabel: string
  rejectLabel: string
  onApprove: (id: string) => void
  onReject: (id: string) => void
}) {
  return (
    <div className="flex justify-end gap-2">
      <Button type="button" variant="destructive" size="lg" onClick={() => onReject(item.id)}>
        {rejectLabel}
      </Button>
      <Button
        type="button"
        size="lg"
        className={productApprovalStatusToneClassNames.APPROVED}
        onClick={() => onApprove(item.id)}
      >
        {approveLabel}
      </Button>
    </div>
  )
}

export { productApprovalStatusToneClassNames }
