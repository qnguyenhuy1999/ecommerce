'use client'

import { Button } from '@ecom/core-ui/atoms/Button'
import { StatusBadge } from '@ecom/core-ui/organisms/DataTable'
import type { OrderDetailRecord } from './OrderDetail.types'

interface OrderDetailActionsProps {
  order: OrderDetailRecord
  forceCancelLabel: string | undefined
  forceCompleteLabel: string | undefined
  onForceCancel: (() => void | Promise<void>) | undefined
  onForceComplete: (() => void | Promise<void>) | undefined
}

export function OrderDetailActions({
  order,
  forceCancelLabel,
  forceCompleteLabel,
  onForceCancel,
  onForceComplete,
}: OrderDetailActionsProps) {
  return (
    <div className="flex items-center gap-2">
      <StatusBadge status={order.status} />
      {order.canForceCancel && (
        <Button
          type="button"
          variant="destructive"
          size="sm"
          onClick={() => void onForceCancel?.()}
        >
          {forceCancelLabel}
        </Button>
      )}
      {order.canForceComplete && (
        <Button type="button" variant="default" size="sm" onClick={() => void onForceComplete?.()}>
          {forceCompleteLabel}
        </Button>
      )}
    </div>
  )
}
