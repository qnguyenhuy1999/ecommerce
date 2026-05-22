'use client'

import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  Typography,
} from '@ecom/core-ui'
import { refundMethodLabels, returnsMoneyFormatter } from './ReturnsRefunds.constants'
import type { RefundMethod, ReturnRow } from './ReturnsRefunds.types'

export function ApproveReturnModal({
  open,
  row,
  refundMethod,
  onClose,
  onConfirm,
}: {
  open: boolean
  row: ReturnRow | null
  refundMethod: RefundMethod
  onClose: () => void
  onConfirm: () => void
}) {
  if (!row || !open) {
    return null
  }

  return (
    <Dialog open={open} onOpenChange={(nextOpen: boolean) => !nextOpen && onClose()}>
      <DialogContent
        showCloseButton={false}
        className="bg-card border-border max-w-lg gap-0 rounded-3xl p-0 shadow-2xl"
      >
        <DialogHeader className="space-y-1 px-6 pt-6 text-left">
          <DialogTitle id="approve-return-title" className="text-foreground text-lg font-semibold">
            Approve full refund?
          </DialogTitle>
          <DialogDescription
            id="approve-return-description"
            className="text-muted-foreground text-sm"
          >
            {row.caseId} · {row.buyerName}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 px-6 py-5">
          <div className="bg-card border-border rounded-2xl border p-4">
            <div className="flex items-center justify-between gap-4">
              <Typography variant="body-sm" className="text-muted-foreground">
                Refund amount
              </Typography>
              <Typography variant="body-sm" className="font-semibold">
                {returnsMoneyFormatter.format(row.amount)}
              </Typography>
            </div>
            <div className="mt-3 flex items-center justify-between gap-4">
              <Typography variant="body-sm" className="text-muted-foreground">
                Refund method
              </Typography>
              <Typography variant="body-sm" className="text-right font-medium">
                {refundMethodLabels[refundMethod]}
              </Typography>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 border-t px-6 py-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="button" onClick={onConfirm}>
            Approve full
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export function ReturnCaseDetail({
  row,
  refundMethod,
  onRefundMethodChange,
  onApprove,
  onPartial,
  onReject,
}: {
  row: ReturnRow
  refundMethod: RefundMethod
  onRefundMethodChange: (method: RefundMethod) => void
  onApprove: () => void
  onPartial: () => void
  onReject: () => void
}) {
  return (
    <>
      <SheetHeader className="pb-4">
        <SheetTitle className="text-foreground text-lg font-bold">{row.caseId}</SheetTitle>
        <SheetDescription className="text-muted-foreground text-sm">
          Order {row.orderNumber} · {row.buyerName}
        </SheetDescription>
      </SheetHeader>

      <div className="flex flex-col gap-4 py-2">
        <div className="bg-card border-border rounded-2xl border p-4">
          <Typography variant="label" className="text-foreground mb-2">
            Reason
          </Typography>
          <Typography variant="muted">{row.reason}</Typography>
        </div>

        {row.evidence && row.evidence.length > 0 && (
          <div className="bg-card border-border rounded-2xl border p-4">
            <Typography variant="label" className="text-foreground mb-3">
              Evidence
            </Typography>
            <div className="flex flex-wrap gap-2">
              {row.evidence.map((src, index) => (
                <img
                  key={index}
                  src={src}
                  alt={`Evidence ${index + 1}`}
                  className="h-32 w-32 rounded-xl object-cover"
                />
              ))}
            </div>
          </div>
        )}

        <div className="bg-card border-border rounded-2xl border p-4">
          <Typography variant="label" className="text-foreground mb-4">
            Decision
          </Typography>
          <div className="mb-4 flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Requested amount</span>
            <span className="text-foreground font-semibold">
              {returnsMoneyFormatter.format(row.amount)}
            </span>
          </div>
          <Select
            value={refundMethod}
            onValueChange={(value) => onRefundMethodChange(value as RefundMethod)}
          >
            <SelectTrigger className="border-input mb-4 w-full rounded-xl">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(Object.entries(refundMethodLabels) as [RefundMethod, string][]).map(
                ([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ),
              )}
            </SelectContent>
          </Select>
          <div className="flex gap-2">
            <Button
              className="bg-success text-success-foreground hover:bg-success/90 flex-1 rounded-full font-semibold"
              onClick={onApprove}
            >
              Approve full
            </Button>
            <Button
              variant="outline"
              className="border-input flex-1 rounded-full font-medium"
              onClick={onPartial}
            >
              Partial
            </Button>
            <Button
              variant="outline"
              className="border-destructive/30 text-destructive hover:bg-destructive/10 flex-1 rounded-full font-medium"
              onClick={onReject}
            >
              Reject
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
