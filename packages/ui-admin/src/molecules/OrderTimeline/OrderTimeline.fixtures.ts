// Exported for consumers and tests
export type TimelineStepStatus = 'completed' | 'current' | 'upcoming' | 'error'

export const TIMELINE_STATUS_CONFIG: Record<
  TimelineStepStatus,
  {
    dotBg: string
    dotBorder: string
    labelColor: string
    descColor: string
    timeColor: string
  }
> = {
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
} as const
