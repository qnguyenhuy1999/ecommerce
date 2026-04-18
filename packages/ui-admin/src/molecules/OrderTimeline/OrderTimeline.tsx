import { cn } from '@ecom/ui'

export interface TimelineStep {
  label: string
  description?: string
  timestamp?: string
  status: 'completed' | 'current' | 'upcoming' | 'error'
}

export interface OrderTimelineProps extends React.HTMLAttributes<HTMLDivElement> {
  steps: TimelineStep[]
}

function OrderTimeline({ steps, className, ...props }: OrderTimelineProps) {
  return (
    <div className={cn('relative', className)} {...props}>
      <div className="absolute top-4 bottom-4 left-[1.1875rem] w-px bg-border max-md:left-4" />

      <div className="space-y-6">
        {steps.map((step, idx) => {
          const isCompleted = step.status === 'completed'
          const isCurrent = step.status === 'current'
          const isError = step.status === 'error'

          return (
            <div key={idx} className="relative flex gap-4 md:gap-6">
              <div className="relative z-10 flex shrink-0 items-center justify-center w-[2.375rem] h-[2.375rem] rounded-full bg-background max-md:w-8 max-md:h-8">
                <div
                  className={cn(
                    'w-3 h-3 rounded-full flex items-center justify-center ring-4 ring-background max-md:w-2 max-md:h-2',
                    isCompleted
                      ? 'bg-brand'
                      : isCurrent
                        ? 'bg-brand ring-brand-muted shrink-0 '
                        : isError
                          ? 'bg-destructive'
                          : 'bg-muted border border-border',
                    isCurrent && 'animate-pulse ring-8 ring-brand-muted/50',
                  )}
                />
              </div>

              <div className="flex flex-col pt-1 min-w-0 flex-1">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                  <p
                    className={cn(
                      'text-sm font-semibold',
                      isUpcoming(step.status) ? 'text-muted-foreground' : 'text-foreground',
                      isError && 'text-destructive',
                    )}
                  >
                    {step.label}
                  </p>
                  {step.timestamp && (
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {step.timestamp}
                    </span>
                  )}
                </div>
                {step.description && (
                  <p className="mt-1 text-[var(--space-4)] text-muted-foreground">{step.description}</p>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function isUpcoming(status: string) {
  return status === 'upcoming'
}

export { OrderTimeline }
