'use client'

import { useIsMobile } from '../../hooks/use-mobile'
import { cn } from '../../lib/utils'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '../../primitives/ui/sheet'
import type { ReviewSheetProps } from './ReviewSheet.types'

export function ReviewSheet({
  open,
  onOpenChange,
  title,
  subtitle,
  footer,
  children,
  className,
}: ReviewSheetProps) {
  const isMobile = useIsMobile()
  const side = isMobile ? 'bottom' : 'right'

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side={side}
        className={cn(
          'flex flex-col gap-0 p-0',
          side === 'right' && 'w-full sm:max-w-xl',
          side === 'bottom' && 'h-[92vh] rounded-t-xl',
          className,
        )}
      >
        {side === 'bottom' && (
          <div
            className="bg-border-strong mx-auto mt-2 h-1 w-10 shrink-0 rounded-full"
            aria-hidden
          />
        )}
        <SheetHeader className="border-border border-b px-4 py-3">
          <SheetTitle className="text-sm font-semibold">{title}</SheetTitle>
          {subtitle && (
            <SheetDescription className="text-2xs text-muted-foreground">
              {subtitle}
            </SheetDescription>
          )}
        </SheetHeader>
        <div className="min-h-0 flex-1 overflow-y-auto p-4">{children}</div>
        {footer && (
          <div className="border-border bg-surface-sunken/50 safe-pb border-t px-4 py-3">
            {footer}
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
