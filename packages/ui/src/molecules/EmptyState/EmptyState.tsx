import React from 'react'

import { cva, type VariantProps } from 'class-variance-authority'

import { Button } from '../../atoms/Button/Button'
import { createStrictContext } from '../../lib/createStrictContext'
import { cn } from '../../lib/utils'

const emptyStateVariants = cva('flex flex-col items-center justify-center text-center', {
  variants: {
    variant: {
      default: 'gap-4 py-16 px-6',
      compact: 'gap-2 py-8 px-4',
      fullpage: 'gap-6 py-32 px-8 min-h-[50vh]',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
})

type EmptyStateVariant = VariantProps<typeof emptyStateVariants>['variant']

interface LegacyAction {
  label: string
  onClick: () => void
  variant?: 'default' | 'brand' | 'outline'
}

interface EmptyStateProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof emptyStateVariants> {
  /** Legacy single-prop API */
  icon?: React.ReactNode
  title?: string
  description?: string
  action?: LegacyAction
  /** Composition children (preferred) */
  children?: React.ReactNode
}

const [EmptyStateProvider, useEmptyState] = createStrictContext<{ variant: EmptyStateVariant }>(
  'EmptyState',
)

function EmptyStateRoot({
  icon,
  title,
  description,
  action,
  variant,
  className,
  children,
  ...props
}: EmptyStateProps) {
  const content = (
    <div className={cn(emptyStateVariants({ variant }), className)} {...props}>
      {/* Legacy prop-based rendering if consumers pass props instead of children */}
      {icon && (
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted text-muted-foreground [&_svg]:h-8 [&_svg]:w-8 [&_svg]:animate-[float_var(--animate-duration-float-empty-state)_ease-in-out_infinite]">
          {icon}
        </div>
      )}

      {(title || description) && (
        <div className="space-y-1.5">
          {title && (
            <h3 className="text-[var(--text-lg)] font-semibold text-foreground">{title}</h3>
          )}
          {description && (
            <p className="text-sm text-muted-foreground max-w-[var(--space-96)]">{description}</p>
          )}
        </div>
      )}

      {action && (
        <Button variant={action.variant || 'outline'} onClick={action.onClick} className="mt-2">
          {action.label}
        </Button>
      )}

      {/* If children are provided, render them after legacy props to allow composition */}
      {children}
    </div>
  )

  return (
    <EmptyStateProvider value={{ variant: variant ?? 'default' }}>{content}</EmptyStateProvider>
  )
}

// Subcomponents for composition
function EmptyStateIcon({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  // Preserve the same wrapper styles as legacy icon area
  useEmptyState()
  return (
    <div
      className={cn(
        'flex h-16 w-16 items-center justify-center rounded-full bg-muted text-muted-foreground [&_svg]:h-8 [&_svg]:w-8 [&_svg]:animate-[float_var(--animate-duration-float-empty-state)_ease-in-out_infinite]',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}
EmptyStateIcon.displayName = 'EmptyState.Icon'

function EmptyStateTitle({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  useEmptyState()
  return (
    <h3 className={cn('text-[var(--text-lg)] font-semibold text-foreground', className)} {...props}>
      {children}
    </h3>
  )
}
EmptyStateTitle.displayName = 'EmptyState.Title'

function EmptyStateDescription({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  useEmptyState()
  return (
    <p
      className={cn('text-sm text-muted-foreground max-w-[var(--space-96)]', className)}
      {...props}
    >
      {children}
    </p>
  )
}
EmptyStateDescription.displayName = 'EmptyState.Description'

function EmptyStateAction({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  useEmptyState()
  return (
    <div className={cn('mt-2', className)} {...props}>
      {children}
    </div>
  )
}
EmptyStateAction.displayName = 'EmptyState.Action'

const EmptyState = Object.assign(EmptyStateRoot, {
  Icon: EmptyStateIcon,
  Title: EmptyStateTitle,
  Description: EmptyStateDescription,
  Action: EmptyStateAction,
})

export { EmptyState }
export type { EmptyStateProps }
