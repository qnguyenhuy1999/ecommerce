import React from 'react'

import { Check } from 'lucide-react'

import { cn } from '@ecom/ui'

export type TimelineStepStatus = 'complete' | 'current' | 'pending'

export interface OrderTimelineStepProps {
  label: string
  date?: string
  description?: string
  status: TimelineStepStatus
  icon?: React.ReactNode
  isLast?: boolean
  className?: string
}

function OrderTimelineStep({
  label,
  date,
  description,
  status,
  icon,
  isLast = false,
  className,
}: OrderTimelineStepProps) {
  const isComplete = status === 'complete'
  const isCurrent = status === 'current'
  const isPending = status === 'pending'

  return (
    <div className={cn('relative flex gap-4', className)}>
      {/* Connector line */}
      {!isLast && (
        <div
          className={cn(
            'absolute left-[0.9375rem] top-8 bottom-0 w-px',
            isComplete ? 'bg-[var(--action-primary)]' : 'bg-[var(--border-subtle)]',
          )}
          aria-hidden="true"
        />
      )}

      {/* Step indicator */}
      <div
        className={cn(
          'relative z-10 flex h-[1.875rem] w-[1.875rem] shrink-0 items-center justify-center rounded-full',
          'transition-all duration-[var(--motion-normal)]',
          isComplete &&
            'bg-[var(--action-primary)] text-[var(--action-primary-foreground)] shadow-sm',
          isCurrent && [
            'bg-[var(--action-primary)] text-[var(--action-primary-foreground)]',
            'ring-4 ring-[var(--action-primary)]/20 shadow-sm',
          ],
          isPending &&
            'bg-[var(--surface-muted)] border-2 border-[var(--border-default)] text-[var(--text-tertiary)]',
        )}
        aria-current={isCurrent ? 'step' : undefined}
      >
        {isComplete ? (
          <Check className="w-3.5 h-3.5" strokeWidth={2.5} />
        ) : (
          (icon ?? (
            <div
              className={cn(
                'w-2 h-2 rounded-full',
                isCurrent ? 'bg-white' : 'bg-[var(--border-default)]',
              )}
            />
          ))
        )}
      </div>

      {/* Step content */}
      <div className="pb-8 pt-0.5 flex-1 min-w-0">
        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
          <p
            className={cn(
              'text-[var(--text-sm)] font-semibold',
              isComplete && 'text-[var(--text-primary)]',
              isCurrent && 'text-[var(--action-primary)]',
              isPending && 'text-[var(--text-tertiary)]',
            )}
          >
            {label}
          </p>
          {date && (
            <time className="text-[length:var(--text-xs)] text-[var(--text-tertiary)]">{date}</time>
          )}
        </div>
        {description && (
          <p className="mt-1 text-[length:var(--text-xs)] text-[var(--text-secondary)] leading-relaxed">
            {description}
          </p>
        )}
      </div>
    </div>
  )
}

export { OrderTimelineStep }
