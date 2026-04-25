'use client'

import React from 'react'

import { Package, ExternalLink } from 'lucide-react'

import { Button, cn } from '@ecom/ui'

import { OrderTimelineStep } from '../../atoms/OrderTimelineStep/OrderTimelineStep'
import type { TimelineStepStatus } from '../../atoms/OrderTimelineStep/OrderTimelineStep'

export interface TimelineStep {
  id: string
  label: string
  description?: string
  date?: string
  status: TimelineStepStatus
  icon?: React.ReactNode
}

export interface TrackingInfo {
  carrier: string
  trackingNumber: string
  trackingUrl?: string
}

export interface OrderTimelineProps {
  steps: TimelineStep[]
  trackingInfo?: TrackingInfo
  className?: string
}

function OrderTimeline({ steps, trackingInfo, className }: OrderTimelineProps) {
  return (
    <div className={cn('space-y-0', className)}>
      {trackingInfo && (
        <div
          className={cn(
            'mb-6 flex items-center justify-between gap-4',
            'rounded-[var(--radius-lg)] border border-[var(--border-subtle)]',
            'bg-[var(--surface-muted)]/50 px-[var(--space-4)] py-[var(--space-3)]',
          )}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <Package className="w-4 h-4 text-[var(--text-secondary)] shrink-0" />
            <div className="min-w-0">
              <p className="text-[length:var(--text-xs)] text-[var(--text-tertiary)]">
                {trackingInfo.carrier}
              </p>
              <p className="text-[var(--text-sm)] font-semibold text-[var(--text-primary)] truncate">
                {trackingInfo.trackingNumber}
              </p>
            </div>
          </div>
          {trackingInfo.trackingUrl && (
            <Button
              variant="outline"
              size="sm"
              className="shrink-0 h-8 text-[length:var(--text-xs)] gap-1.5"
              onClick={() => window.open(trackingInfo.trackingUrl, '_blank')}
            >
              Track
              <ExternalLink className="w-3 h-3" />
            </Button>
          )}
        </div>
      )}

      <div>
        {steps.map((step, index) => (
          <OrderTimelineStep
            key={step.id}
            label={step.label}
            date={step.date}
            description={step.description}
            status={step.status}
            icon={step.icon}
            isLast={index === steps.length - 1}
            nextStatus={steps[index + 1]?.status}
          />
        ))}
      </div>
    </div>
  )
}

export { OrderTimeline }
