import { cn } from '@ecom/ui'
import { Check } from 'lucide-react'

export interface TimelineStep {
  label: string
  description?: string
  timestamp?: string
  status: 'completed' | 'current' | 'upcoming' | 'error'
  icon?: React.ReactNode
}

export interface OrderTimelineProps extends React.HTMLAttributes<HTMLDivElement> {
  steps: TimelineStep[]
}

const statusConfig = {
  completed: {
    dotBg: 'bg-[var(--intent-success)]',
    dotBorder: 'border-transparent',
    labelColor: 'text-[var(--text-primary)]',
    descColor: 'text-[var(--text-secondary)]',
    timeColor: 'text-[var(--text-secondary)]',
  },
  current: {
    dotBg: 'bg-[var(--intent-info)]',
    dotBorder: 'border-transparent',
    labelColor: 'text-[var(--text-primary)]',
    descColor: 'text-[var(--text-secondary)]',
    timeColor: 'text-[var(--text-secondary)]',
  },
  error: {
    dotBg: 'bg-[var(--intent-danger)]',
    dotBorder: 'border-transparent',
    labelColor: 'text-[var(--intent-danger)]',
    descColor: 'text-[var(--text-secondary)]',
    timeColor: 'text-[var(--text-secondary)]',
  },
  upcoming: {
    dotBg: 'bg-[var(--surface-base)]',
    dotBorder: 'border-[var(--border-default)]',
    labelColor: 'text-[var(--text-secondary)]',
    descColor: 'text-[var(--text-tertiary)]',
    timeColor: 'text-[var(--text-tertiary)]',
  },
}

function OrderTimeline({ steps, className, ...props }: OrderTimelineProps) {
  const completedCount = steps.filter((s) => s.status === 'completed').length - 1

  return (
    <div className={cn('relative', className)} {...props}>
      {/* Filled progress line (shows completed portion) */}
      <div
        className="absolute left-[0.5625rem] top-4 w-0.5 bg-[var(--intent-success)] max-md:left-[0.4375rem] max-md:top-3"
        style={{
          height: `calc((100% - 2rem) * ${completedCount / (steps.length - 1)})`,
          opacity: 0.35,
        }}
      />

      {/* Base connector line */}
      <div
        className="absolute left-[0.5625rem] top-4 bottom-4 w-px bg-[var(--border-subtle)] max-md:left-[0.4375rem] max-md:top-3 max-md:bottom-3"
        style={{ zIndex: 0 }}
      />

      <div className="space-y-0">
        {steps.map((step, idx) => {
          const cfg = statusConfig[step.status]
          const isLast = idx === steps.length - 1

          return (
            <div
              key={idx}
              className={cn('relative flex items-start gap-3', !isLast && 'pb-5 max-md:pb-4')}
            >
              {/* Node */}
              <div
                className={cn(
                  'relative z-10 flex shrink-0 items-center justify-center mt-[3px]',
                  'w-[1.125rem] h-[1.125rem] rounded-full border-2 max-md:w-[0.9375rem] max-md:h-[0.9375rem]',
                  'transition-all duration-200',
                  cfg.dotBg,
                  cfg.dotBorder,
                )}
              >
                {step.status === 'completed' && (
                  <Check className="w-2.5 h-2.5 text-white stroke-[2.5]" />
                )}
                {step.status === 'upcoming' && (
                  <div className="w-1 h-1 rounded-full bg-[var(--border-strong)]" />
                )}
                {step.status === 'error' && (
                  <span className="text-[8px] font-bold text-white leading-none -mt-px">!</span>
                )}
                {step.status === 'current' && (
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white" />
                  </span>
                )}
              </div>

              {/* Content */}
              <div className="flex flex-col flex-1 min-w-0 mt-0.5">
                {/* Label row */}
                <p className={cn('text-[13px] font-medium leading-snug', cfg.labelColor)}>
                  {step.label}
                </p>

                {/* Timestamp */}
                {step.timestamp && (
                  <p className={cn('mt-0.5 text-[11px]', cfg.timeColor)}>{step.timestamp}</p>
                )}

                {/* Description */}
                {step.description && (
                  <p className={cn('mt-0.5 text-[12px] leading-relaxed', cfg.descColor)}>
                    {step.description}
                  </p>
                )}

                {/* Inline badge */}
                {step.status === 'current' && (
                  <div className="mt-1.5 inline-flex items-center gap-1.5">
                    <span
                      className="inline-block w-4 h-px bg-[var(--intent-info)]"
                      style={{ opacity: 0.5 }}
                    />
                    <span className="text-[10px] font-medium text-[var(--intent-info)] tracking-widest uppercase">
                      In Progress
                    </span>
                  </div>
                )}
                {step.status === 'error' && (
                  <div className="mt-1.5 inline-flex items-center gap-1.5">
                    <span
                      className="inline-block w-4 h-px bg-[var(--intent-danger)]"
                      style={{ opacity: 0.5 }}
                    />
                    <span className="text-[10px] font-medium text-[var(--intent-danger)] tracking-widest uppercase">
                      Issue Detected
                    </span>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export { OrderTimeline }
