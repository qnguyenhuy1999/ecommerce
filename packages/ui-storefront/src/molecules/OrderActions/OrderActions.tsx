import React from 'react'

import { Download, MapPin, RotateCcw, Star, Truck, XCircle } from 'lucide-react'

import { Button, cn } from '@ecom/ui'
import type { OrderStatus } from '../../atoms/OrderStatusBadge/OrderStatusBadge'

export interface OrderActionsProps {
  status: OrderStatus
  onTrack?: () => void
  onReorder?: () => void
  onCancel?: () => void
  onChangeAddress?: () => void
  onWriteReview?: () => void
  onDownloadInvoice?: () => void
  className?: string
}

interface ActionDescriptor {
  key: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  onClick?: () => void
  variant: 'primary' | 'secondary'
  tone?: 'default' | 'danger'
}

function getContextualActions({
  status,
  onTrack,
  onReorder,
  onCancel,
  onChangeAddress,
  onWriteReview,
  onDownloadInvoice,
}: OrderActionsProps): { primary?: ActionDescriptor; secondary?: ActionDescriptor } {
  switch (status) {
    case 'PENDING_PAYMENT':
    case 'PAID':
    case 'PROCESSING': {
      const primary = onCancel
        ? {
            key: 'cancel',
            label: 'Cancel order',
            icon: XCircle,
            onClick: onCancel,
            variant: 'primary' as const,
            tone: 'danger' as const,
          }
        : undefined
      const secondary = onChangeAddress
        ? {
            key: 'address',
            label: 'Change address',
            icon: MapPin,
            onClick: onChangeAddress,
            variant: 'secondary' as const,
          }
        : undefined
      return { primary, secondary }
    }
    case 'SHIPPED': {
      const primary = onTrack
        ? {
            key: 'track',
            label: 'Track order',
            icon: Truck,
            onClick: onTrack,
            variant: 'primary' as const,
          }
        : undefined
      return { primary }
    }
    case 'COMPLETED': {
      const primary = onReorder
        ? {
            key: 'buy-again',
            label: 'Buy again',
            icon: RotateCcw,
            onClick: onReorder,
            variant: 'primary' as const,
          }
        : undefined
      let secondary: ActionDescriptor | undefined
      if (onWriteReview) {
        secondary = {
          key: 'review',
          label: 'Write review',
          icon: Star,
          onClick: onWriteReview,
          variant: 'secondary',
        }
      } else if (onDownloadInvoice) {
        secondary = {
          key: 'invoice',
          label: 'Invoice',
          icon: Download,
          onClick: onDownloadInvoice,
          variant: 'secondary',
        }
      }
      return { primary, secondary }
    }
    case 'CANCELLED':
    case 'REFUNDED':
    case 'PENDING_REFUND': {
      const primary = onReorder
        ? {
            key: 'reorder',
            label: 'Reorder',
            icon: RotateCcw,
            onClick: onReorder,
            variant: 'primary' as const,
          }
        : undefined
      return { primary }
    }
    default:
      return {}
  }
}

/**
 * Encapsulates the logic for which actions to display for a given order status.
 * Renders exactly ONE primary button and ONE secondary button maximum.
 */
function OrderActions({
  status,
  onTrack,
  onReorder,
  onCancel,
  onChangeAddress,
  onWriteReview,
  onDownloadInvoice,
  className,
}: OrderActionsProps) {
  const { primary, secondary } = getContextualActions({
    status,
    onTrack,
    onReorder,
    onCancel,
    onChangeAddress,
    onWriteReview,
    onDownloadInvoice,
  })

  if (!primary && !secondary) return null

  return (
    <div className={cn('flex items-center justify-end gap-3', className)}>
      {secondary && secondary.onClick && (
        <Button
          variant="ghost"
          size="sm"
          onClick={(event) => {
            event.stopPropagation()
            secondary.onClick?.()
          }}
          className={cn(
            'h-9 gap-1.5 px-3 text-sm font-medium',
            'text-[var(--text-secondary)] hover:text-[var(--text-primary)]',
          )}
        >
          <secondary.icon className="h-4 w-4" aria-hidden="true" />
          {secondary.label}
        </Button>
      )}

      {primary && primary.onClick && (
        <Button
          variant={primary.tone === 'danger' ? 'destructive' : 'default'}
          size="sm"
          onClick={(event) => {
            event.stopPropagation()
            primary.onClick?.()
          }}
          className={cn(
            'h-9 gap-1.5 px-4 text-sm font-medium',
            primary.tone !== 'danger' &&
              'bg-[var(--text-primary)] text-[var(--surface-base)] hover:bg-[var(--text-primary)]/90',
          )}
        >
          <primary.icon className="h-4 w-4" aria-hidden="true" />
          {primary.label}
        </Button>
      )}
    </div>
  )
}

export { OrderActions }
