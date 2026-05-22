'use client'

import {
  Badge,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  Label,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
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

export function ProductApprovalDetailSheet({
  item,
  approveLabel,
  rejectLabel,
  onApprove,
  onReject,
}: {
  item: ProductApprovalItem | null
  approveLabel: string
  rejectLabel: string
  onApprove: (id: string) => void
  onReject: (id: string) => void
}) {
  if (!item) {
    return null
  }

  return (
    <>
      <SheetHeader>
        <SheetTitle className="text-foreground text-lg font-bold">{item.title}</SheetTitle>
        <SheetDescription className="text-muted-foreground text-sm">
          {item.sellerName} · submitted {item.submittedAtLabel}
        </SheetDescription>
      </SheetHeader>

      <div className="flex flex-col gap-6 px-4">
        <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
          {item.images.map((image) => (
            <div
              key={image.id}
              className="border-border aspect-square w-full rounded-md border object-cover"
            >
              <img src={image.src} alt={image.alt} className="h-full w-full object-cover" />
            </div>
          ))}
        </div>

        <Card>
          <CardContent className="space-y-3">
            <div>
              <Typography as="p" variant="label" className="text-foreground font-semibold">
                {item.title}
              </Typography>
              <Typography variant="body-sm" className="text-primary mt-3 scroll-m-0 font-semibold">
                {item.priceLabel}
              </Typography>
            </div>
            <div className="text-muted-foreground flex flex-wrap items-center gap-2 text-sm font-normal">
              <span>{item.stockLabel}</span>
              <span>·</span>
              <span>{item.soldLabel}</span>
              <span>·</span>
              <span>{item.ratingLabel}</span>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Typography
            as="h3"
            variant="label"
            className="text-foreground text-base font-semibold sm:text-lg"
          >
            Policy tags
          </Typography>
          <div className="flex flex-wrap gap-3">
            <ReasonTags item={item} emptyLabel="No policy tags" tone="neutral" />
          </div>
        </div>
      </div>

      <SheetFooter className="mt-0 flex-row justify-end gap-2 px-8 py-6">
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
      </SheetFooter>
    </>
  )
}

export { productApprovalStatusToneClassNames }
