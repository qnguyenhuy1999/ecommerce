'use client'

import * as React from 'react'
import { cn } from '../../lib/utils'

/* --- Popover ------------------------------------------------------------- */
interface PopoverProps {
  children: React.ReactNode
}

interface PopoverContextValue {
  open: boolean
  setOpen: (open: boolean) => void
  triggerRef: React.RefObject<HTMLButtonElement | null>
}

const PopoverContext = React.createContext<PopoverContextValue | null>(null)

function Popover({ children }: PopoverProps) {
  const [open, setOpen] = React.useState(false)
  const triggerRef = React.useRef<HTMLButtonElement>(null)

  return (
    <PopoverContext.Provider value={{ open, setOpen, triggerRef }}>
      <div className="relative inline-block">{children}</div>
    </PopoverContext.Provider>
  )
}

/* --- Trigger ------------------------------------------------------------- */
interface PopoverTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
}

const PopoverTrigger = React.forwardRef<HTMLButtonElement, PopoverTriggerProps>(
  ({ className, onClick, children, ...props }, ref) => {
    const ctx = React.useContext(PopoverContext)
    if (!ctx) throw new Error('PopoverTrigger must be used within Popover')

    return (
      <button
        ref={(node) => {
          if (typeof ref === 'function') ref(node)
          else if (ref) (ref as React.MutableRefObject<HTMLButtonElement | null>).current = node
          ;(ctx.triggerRef as React.MutableRefObject<HTMLButtonElement | null>).current = node
        }}
        className={className}
        onClick={(e) => {
          ctx.setOpen(!ctx.open)
          onClick?.(e)
        }}
        aria-expanded={ctx.open}
        aria-haspopup="true"
        {...props}
      >
        {children}
      </button>
    )
  },
)
PopoverTrigger.displayName = 'PopoverTrigger'

/* --- Content ------------------------------------------------------------- */
interface PopoverContentProps extends React.HTMLAttributes<HTMLDivElement> {
  align?: 'start' | 'center' | 'end'
  side?: 'top' | 'bottom'
  sideOffset?: number
}

const PopoverContent = React.forwardRef<HTMLDivElement, PopoverContentProps>(
  ({ align = 'center', side = 'bottom', className, children, ...props }, ref) => {
    const ctx = React.useContext(PopoverContext)
    if (!ctx) throw new Error('PopoverContent must be used within Popover')

    const contentRef = React.useRef<HTMLDivElement>(null)

    // Close on click outside
    React.useEffect(() => {
      if (!ctx.open) return
      function handleClick(e: MouseEvent) {
        const target = e.target as Node
        if (
          contentRef.current &&
          !contentRef.current.contains(target) &&
          ctx!.triggerRef.current &&
          !ctx!.triggerRef.current.contains(target)
        ) {
          ctx!.setOpen(false)
        }
      }
      document.addEventListener('mousedown', handleClick)
      return () => document.removeEventListener('mousedown', handleClick)
    }, [ctx])

    // Close on Escape
    React.useEffect(() => {
      if (!ctx.open) return
      function handleKey(e: KeyboardEvent) {
        if (e.key === 'Escape') ctx!.setOpen(false)
      }
      document.addEventListener('keydown', handleKey)
      return () => document.removeEventListener('keydown', handleKey)
    }, [ctx])

    if (!ctx.open) return null

    return (
      <div
        ref={(node) => {
          if (typeof ref === 'function') ref(node)
          else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node
          ;(contentRef as React.MutableRefObject<HTMLDivElement | null>).current = node
        }}
        className={cn(
          'absolute z-50 min-w-[8rem] rounded-[8px] border bg-popover p-4 text-popover-foreground',
          'shadow-[var(--elevation-dropdown)]',
          'animate-[scale-in_150ms_ease-out]',
          side === 'bottom' && 'top-full mt-2',
          side === 'top' && 'bottom-full mb-2',
          align === 'start' && 'left-0',
          align === 'center' && 'left-1/2 -translate-x-1/2',
          align === 'end' && 'right-0',
          className,
        )}
        {...props}
      >
        {children}
      </div>
    )
  },
)
PopoverContent.displayName = 'PopoverContent'

export { Popover, PopoverTrigger, PopoverContent }
export type { PopoverProps, PopoverTriggerProps, PopoverContentProps }
