'use client'

import * as React from 'react'
import { cn } from '../../lib/utils'
import { X } from 'lucide-react'

/* --- Types --------------------------------------------------------------- */
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

/* --- Context ------------------------------------------------------------- */
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

/* --- Provider ------------------------------------------------------------ */
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

/* --- Individual Toast ---------------------------------------------------- */
const variantStyles: Record<ToastVariant, string> = {
  default: 'border-border bg-background text-foreground',
  success: 'border-success/30 bg-success-muted text-foreground',
  warning: 'border-warning/30 bg-warning-muted text-foreground',
  error: 'border-destructive/30 bg-destructive/10 text-foreground',
  info: 'border-info/30 bg-info-muted text-foreground',
}

function ToastItem({ toast }: { toast: ToastData }) {
  const { removeToast } = useToast()
  const [exiting, setExiting] = React.useState(false)

  React.useEffect(() => {
    const duration = toast.duration ?? 5000
    const timer = setTimeout(() => setExiting(true), duration)
    return () => clearTimeout(timer)
  }, [toast.duration])

  React.useEffect(() => {
    return exiting
      ? (() => {
          const timer = setTimeout(() => removeToast(toast.id), 200)
          return () => clearTimeout(timer)
        })()
      : undefined
  }, [exiting, toast.id, removeToast])

  return (
    <div
      className={cn(
        'relative flex w-full items-start gap-3 rounded-[8px] border p-4 shadow-[var(--elevation-dropdown)]',
        'transition-all duration-200',
        exiting ? 'opacity-0 translate-x-4' : 'opacity-100 translate-x-0',
        'animate-[slide-up_250ms_ease-out]',
        variantStyles[toast.variant || 'default'],
      )}
      role="alert"
    >
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold leading-tight">{toast.title}</p>
        {toast.description && (
          <p className="mt-1 text-sm text-muted-foreground">{toast.description}</p>
        )}
        {toast.action && (
          <button
            onClick={toast.action.onClick}
            className="mt-2 text-sm font-medium text-brand hover:text-brand-hover transition-colors"
          >
            {toast.action.label}
          </button>
        )}
      </div>
      <button
        onClick={() => setExiting(true)}
        className="shrink-0 rounded-[4px] p-0.5 opacity-60 hover:opacity-100 transition-opacity"
        aria-label="Dismiss"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  )
}

/* --- Toaster Container --------------------------------------------------- */
function Toaster() {
  const { toasts } = useToast()

  if (toasts.length === 0) return null

  return (
    <div
      className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 w-full max-w-sm pointer-events-none"
      aria-live="polite"
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
