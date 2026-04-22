import { AlertTriangle, CheckCircle, Info, Package } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

// Exported for consumers and tests
export const NOTIFICATION_TYPE_CONFIG: Record<
  'info' | 'success' | 'warning' | 'error' | 'order',
  { icon: LucideIcon; color: string; bg: string }
> = {
  info: { icon: Info, color: 'text-[var(--intent-info)]', bg: 'bg-[var(--intent-info-muted)]' },
  success: {
    icon: CheckCircle,
    color: 'text-[var(--intent-success)]',
    bg: 'bg-[var(--intent-success-muted)]',
  },
  warning: {
    icon: AlertTriangle,
    color: 'text-[var(--intent-warning)]',
    bg: 'bg-[var(--intent-warning-muted)]',
  },
  error: {
    icon: AlertTriangle,
    color: 'text-[var(--intent-danger)]',
    bg: 'bg-[var(--intent-danger-muted)]',
  },
  order: { icon: Package, color: 'text-[var(--action-primary)]', bg: 'bg-[var(--action-muted)]' },
} as const
