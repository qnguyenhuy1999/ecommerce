import { CheckCircle, AlertTriangle, XCircle, Info, Bell } from 'lucide-react'

// Exported for consumers and tests
export type ToastVariant = 'default' | 'success' | 'warning' | 'error' | 'info'

export type ToastVariantConfig = {
  IconComponent: typeof CheckCircle | null
  progressClass: string
  accentClass: string
  iconClass: string
}

export const VARIANT_CONFIG: Record<ToastVariant, ToastVariantConfig> = {
  default: {
    IconComponent: Bell,
    progressClass: 'bg-[var(--text-tertiary)]',
    accentClass: 'bg-[var(--surface-subtle)]',
    iconClass: 'text-[var(--intent-info)]',
  },
  success: {
    IconComponent: CheckCircle,
    progressClass: 'bg-[var(--intent-success)]',
    accentClass: 'bg-[var(--intent-success)]',
    iconClass: 'text-[var(--intent-success)]',
  },
  warning: {
    IconComponent: AlertTriangle,
    progressClass: 'bg-[var(--intent-warning)]',
    accentClass: 'bg-[var(--intent-warning)]',
    iconClass: 'text-[var(--intent-warning)]',
  },
  error: {
    IconComponent: XCircle,
    progressClass: 'bg-[var(--intent-danger)]',
    accentClass: 'bg-[var(--intent-danger)]',
    iconClass: 'text-[var(--intent-danger)]',
  },
  info: {
    IconComponent: Info,
    progressClass: 'bg-[var(--intent-info)]',
    accentClass: 'bg-[var(--intent-info)]',
    iconClass: 'text-[var(--intent-info)]',
  },
} as const
