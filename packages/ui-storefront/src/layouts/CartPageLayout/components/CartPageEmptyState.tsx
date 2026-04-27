import { Button, cn } from '@ecom/ui'

export interface CartPageEmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string
  description?: string
  actionHref?: string
  actionLabel?: string
}

export function CartPageEmptyState({
  title = 'Your cart is empty',
  description = "Looks like you haven't added anything yet. Let's fix that.",
  actionHref = '/shop',
  actionLabel = 'Start Shopping',
  className,
  ...props
}: CartPageEmptyStateProps) {
  return (
    <section
      className={cn(
        'rounded-[var(--radius-lg)] border border-dashed border-[var(--border-default)] bg-[var(--surface-base)] p-10 text-center shadow-[var(--elevation-card)]',
        className,
      )}
      {...props}
    >
      <h2 className="text-2xl font-semibold text-[var(--text-primary)]">{title}</h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-[var(--text-secondary)]">{description}</p>
      <div className="mt-6">
        <a href={actionHref}>
          <Button size="lg">{actionLabel}</Button>
        </a>
      </div>
    </section>
  )
}
