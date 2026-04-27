import { cn } from '@ecom/ui'

export type CartPageLoadingProps = React.HTMLAttributes<HTMLDivElement>

export function CartPageLayoutLoading({ className, ...props }: CartPageLoadingProps) {
  return (
    <div
      className={cn('mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8', className)}
      aria-busy="true"
      aria-live="polite"
      {...props}
    >
      <div className="h-10 w-48 animate-pulse rounded-md bg-[var(--surface-muted)]" />
      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start">
        <div className="space-y-3">
          <div className="h-28 animate-pulse rounded-[var(--radius-lg)] bg-[var(--surface-muted)]" />
          <div className="h-28 animate-pulse rounded-[var(--radius-lg)] bg-[var(--surface-muted)]" />
          <div className="h-28 animate-pulse rounded-[var(--radius-lg)] bg-[var(--surface-muted)]" />
        </div>
        <div className="h-64 animate-pulse rounded-[var(--radius-lg)] bg-[var(--surface-muted)]" />
      </div>
    </div>
  )
}
