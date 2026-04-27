import React from 'react'

import { Check } from 'lucide-react'

import { cn } from '@ecom/ui/utils'

export type TimelineStepStatus = 'complete' | 'current' | 'pending'

export interface OrderTimelineStepProps {
  label: string
  date?: string
  description?: string
  status: TimelineStepStatus
  icon?: React.ReactNode
  isLast?: boolean
  /** Status of the *next* step. Drives the connector line styling between this step and the next. */
  nextStatus?: TimelineStepStatus
  className?: string
}

function OrderTimelineStep({
  label,
  date,
  description,
  status,
  icon,
  isLast = false,
  nextStatus,
  className,
}: OrderTimelineStepProps) {
  const isComplete = status === 'complete'
  const isCurrent = status === 'current'
  const isPending = status === 'pending'

  // Solid line below a completed step; dashed when the next step is pending.
  const connectorClass = isComplete
    ? 'bg-[var(--action-primary)]'
    : isCurrent
      ? nextStatus === 'pending'
        ? 'border-l-2 border-dashed border-[var(--border-default)] !bg-transparent'
        : 'bg-[var(--border-default)]'
      : 'border-l-2 border-dashed border-[var(--border-default)] !bg-transparent'

  return (
    <div className={cn('relative flex gap-4', className)}>
      {/* Connector line */}
      {!isLast && (
        <div
          className={cn('absolute left-[0.9375rem] top-8 bottom-0 w-px', connectorClass)}
          aria-hidden="true"
        />
      )}

      {/* Step indicator */}
      <div className="relative z-10 shrink-0">
        {isCurrent && (
          <span
            aria-hidden="true"
            className={cn(
              'absolute inset-0 rounded-full',
              'bg-[var(--action-primary)] opacity-30 animate-ping',
            )}
          />
        )}
        <div
          className={cn(
            'relative flex h-[1.875rem] w-[1.875rem] items-center justify-center rounded-full',
            'transition-all duration-[var(--motion-normal)]',
            isComplete &&
              'bg-[var(--action-primary)] text-[var(--action-primary-foreground)] shadow-sm',
            isCurrent && [
              'bg-[var(--action-primary)] text-[var(--action-primary-foreground)] shadow-sm',
              'ring-4 ring-[rgb(var(--brand-500-rgb)/0.18)]',
            ],
            isPending &&
              'border-2 border-dashed border-[var(--border-default)] bg-[var(--surface-base)] text-[var(--text-tertiary)]',
          )}
          aria-current={isCurrent ? 'step' : undefined}
        >
          {isComplete ? (
            <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
          ) : icon ? (
            <span className="flex h-3.5 w-3.5 items-center justify-center">{icon}</span>
          ) : (
            <span
              className={cn(
                'h-2 w-2 rounded-full',
                isCurrent ? 'bg-white' : 'bg-[var(--border-default)]',
              )}
            />
          )}
        </div>
      </div>

      {/* Step content */}
      <div className="min-w-0 flex-1 pb-8 pt-0.5">
        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
          <p
            className={cn(
              'text-sm font-semibold',
              isComplete && 'text-[var(--text-primary)]',
              isCurrent && 'text-[var(--text-primary)]',
              isPending && 'text-[var(--text-tertiary)]',
            )}
          >
            {label}
          </p>
          {isCurrent && (
            <span
              className={cn(
                'inline-flex items-center gap-1 rounded-full',
                'bg-[rgb(var(--brand-500-rgb)/0.12)] px-2 py-0.5',
                'text-[length:var(--text-micro)] font-semibold uppercase tracking-[0.08em] text-[var(--action-primary)]',
              )}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--action-primary)] animate-pulse" />
              In progress
            </span>
          )}
          {date && (
            <time className="text-[length:var(--text-xs)] text-[var(--text-tertiary)] tabular-nums">
              {date}
            </time>
          )}
        </div>
        {description && (
          <p
            className={cn(
              'mt-1 text-[length:var(--text-xs)] leading-[var(--line-height-relaxed)]',
              isPending ? 'text-[var(--text-tertiary)]' : 'text-[var(--text-secondary)]',
            )}
          >
            {description}
          </p>
        )}
      </div>
    </div>
  )
}

export { OrderTimelineStep }
