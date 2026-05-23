'use client'

import { Button } from '@ecom/core-ui'
import { ArrowLeft } from 'lucide-react'
import { SectionCard } from '../../atoms/SectionCard'
import type { OrderDetailClientProps } from './OrderDetail.controller'

export type { OrderDetailClientProps }

export function LoadingState() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="surface-card h-28 animate-pulse rounded-[24px]" />
      ))}
    </div>
  )
}

export function EmptyState({ message }: { message: string }) {
  return (
    <SectionCard padded={false}>
      <div className="text-muted-foreground px-5 py-10 text-center text-sm">{message}</div>
    </SectionCard>
  )
}

export function OrderDetailActions({
  backHref,
  statusActions,
  onStatusAction,
  actionInFlight,
}: Pick<
  OrderDetailClientProps,
  'backHref' | 'statusActions' | 'onStatusAction' | 'actionInFlight'
>) {
  return (
    <>
      <Button asChild size="sm" variant="outline">
        <a href={backHref}>
          <ArrowLeft />
          Back to orders
        </a>
      </Button>
      {statusActions?.map((action) => {
        const isPending = actionInFlight === action.nextStatus

        return (
          <Button
            key={action.id}
            size="sm"
            variant={action.nextStatus === 'CANCELLED' ? 'outline' : 'default'}
            onClick={() => void onStatusAction?.(action.nextStatus)}
            disabled={actionInFlight != null}
          >
            {isPending ? 'Updating...' : action.label}
          </Button>
        )
      })}
    </>
  )
}
