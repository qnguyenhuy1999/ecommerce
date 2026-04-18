'use client'

import React from 'react'

import { CheckCircle, AlertTriangle, XCircle, Info, X } from 'lucide-react'

import { cn } from '../../lib/utils'

export type ToastVariant = 'default' | 'success' | 'warning' | 'error' | 'info'

export interface ToastData {
  id: string
  title: string
  description?: string
  variant?: ToastVariant
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
}

interface ToastContextValue {
  toasts: ToastData[]
  addToast: (toast: Omit<ToastData, 'id'>) => string
  removeToast: (id: string) => void
}

const ToastContext = React.createContext<ToastContextValue | null>(null)

export function useToast() {
  const ctx = React.useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within a ToastProvider')
  return ctx
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToastData[]>([])

  const addToast = React.useCallback((toast: Omit<ToastData, 'id'>) => {
    const id = crypto.randomUUID()
    setToasts((prev) => [...prev, { ...toast, id }])
    return id
  }, [])

  const removeToast = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <Toaster />
    </ToastContext.Provider>
  )
}

type ToastVariantConfig = {
  IconComponent: typeof CheckCircle | null
  progressClass: string
  accentClass: string
  iconClass: string
}

const VARIANT_CONFIG: Record<ToastVariant, ToastVariantConfig> = {
  default: {
    IconComponent: null,
    progressClass: 'bg-[var(--text-tertiary)]',
    accentClass: 'bg-[var(--surface-subtle)]',
    iconClass: 'text-[var(--text-tertiary)]',
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
}

function ToastItem({ toast }: { toast: ToastData }) {
  const { removeToast } = useToast()
  const [exiting, setExiting] = React.useState(false)
  const [progress, setProgress] = React.useState(100)
  const duration = toast.duration ?? 5000

  // Real-time progress + auto-dismiss
  React.useEffect(() => {
    const startTime = Date.now()
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime
      const remaining = Math.max(0, 100 - (elapsed / duration) * 100)
      setProgress(remaining)
      if (remaining <= 0) clearInterval(interval)
    }, 50)
    return () => {
      clearInterval(interval)
    }
  }, [duration])

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setExiting(true)
    }, duration)
    return () => {
      clearTimeout(timer)
    }
  }, [duration])

  React.useEffect(() => {
    if (!exiting) return
    const timer = setTimeout(() => {
      removeToast(toast.id)
    }, 300)
    return () => {
      clearTimeout(timer)
    }
  }, [exiting, toast.id, removeToast])

  const variant = toast.variant || 'default'
  const { IconComponent, progressClass, accentClass, iconClass } = VARIANT_CONFIG[variant]

  return (
    <div
      className={cn(
        'relative flex w-full overflow-hidden rounded-[var(--toast-radius)] border bg-[var(--toast-bg)] shadow-[var(--toast-elevation)]',
        'transition-all duration-300 ease-[var(--ease-out)]',
        exiting ? 'opacity-0 translate-x-full scale-95' : 'opacity-100 translate-x-0 scale-100',
      )}
      role="alert"
      aria-live="polite"
    >
      {/* Left accent bar */}
      <div
        className={cn(
          'shrink-0 w-[var(--toast-accent-width)] rounded-l-[var(--toast-radius)]',
          accentClass,
        )}
      />

      {/* Content */}
      <div className="flex flex-1 items-start gap-[var(--toast-gap)] px-[var(--toast-padding)] py-[var(--toast-padding)]">
        {/* Icon */}
        <div className={cn('mt-0.5 shrink-0', iconClass)}>
          {IconComponent ? (
            <IconComponent size={20} strokeWidth={2} />
          ) : (
            <div className="h-5 w-5 rounded-full bg-[var(--surface-subtle)]" />
          )}
        </div>

        {/* Text block */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold leading-tight text-[var(--text-primary)]">
            {toast.title}
          </p>
          {toast.description && (
            <p className="mt-1 text-sm leading-snug text-[var(--text-secondary)]">
              {toast.description}
            </p>
          )}
          {toast.action && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                toast.action?.onClick()
                setExiting(true)
              }}
              className={cn(
                'mt-2 text-sm font-medium transition-all duration-[var(--motion-fast)]',
                'hover:opacity-80 active:scale-95',
                'rounded-[var(--radius-xs)] px-1 py-0.5 -ml-1',
                variant === 'default'
                  ? 'text-[var(--text-link)] hover:text-[var(--text-link-hover)]'
                  : iconClass,
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1',
                variant === 'default'
                  ? 'focus-visible:ring-[var(--focus-ring-color)]'
                  : 'focus-visible:ring-current',
              )}
            >
              {toast.action.label}
            </button>
          )}
        </div>

        {/* Dismiss */}
        <button
          onClick={() => {
            setExiting(true)
          }}
          className={cn(
            'shrink-0 rounded-[var(--radius-xs)] p-1.5 transition-all duration-[var(--motion-fast)]',
            'text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]',
            'hover:bg-[var(--surface-subtle)] active:scale-95',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring-color)] focus-visible:ring-offset-1',
          )}
          aria-label="Dismiss"
        >
          <X size={14} strokeWidth={2.5} />
        </button>
      </div>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-[var(--toast-progress-height)] bg-[var(--border-subtle)] overflow-hidden">
        <div
          className={cn('h-full origin-left transition-none', progressClass)}
          style={{ width: `${String(progress)}%` }}
        />
      </div>
    </div>
  )
}

function Toaster() {
  const { toasts } = useToast()

  if (toasts.length === 0) return null

  return (
    <div
      className="fixed bottom-4 right-4 z-[var(--toast-z-index)] flex flex-col gap-2.5 w-full max-w-[var(--toast-max-width)] pointer-events-none"
      aria-live="polite"
      aria-label="Notifications"
    >
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <ToastItem toast={toast} />
        </div>
      ))}
    </div>
  )
}

export { Toaster }
