import { cn } from '@ecom/ui'

import { StorefrontSection } from '../../layouts/shared/StorefrontSection'

export interface QuickNavItem {
  icon: React.ReactNode
  label: string
  href: string
}

export interface QuickNavSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  items: QuickNavItem[]
  /**
   * Layout style.
   * `grid` (default): tile grid suitable as a homepage shortcuts row.
   * `chips`: scrollable horizontal chip strip — closer to a marketplace category bar.
   */
  variant?: 'grid' | 'chips'
}

function QuickNavSection({ items, className, variant = 'grid', ...props }: QuickNavSectionProps) {
  if (variant === 'chips') {
    return (
      <StorefrontSection
        spacing="compact"
        className={cn(className)}
        contentClassName="!max-w-none"
        {...props}
      >
        <div
          className={cn(
            '-mx-[var(--space-4)] md:-mx-[var(--space-6)] lg:-mx-[var(--space-8)]',
            'overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden',
          )}
        >
          <div className="flex w-max items-center gap-[var(--space-2)] px-[var(--space-4)] md:px-[var(--space-6)] lg:px-[var(--space-8)]">
            {items.map((item, index) => (
              <a
                key={index}
                href={item.href}
                className={cn(
                  'group inline-flex items-center gap-[var(--space-2)] shrink-0',
                  'h-10 rounded-full px-[var(--space-4)]',
                  'border border-[var(--border-subtle)] bg-[var(--surface-base)]',
                  'text-[length:var(--text-sm)] font-medium text-[var(--text-secondary)]',
                  'transition-[background-color,border-color,color,transform] duration-[var(--motion-fast)] ease-[var(--motion-ease-default)]',
                  'hover:border-[var(--border-default)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-muted)]',
                  'active:scale-[0.97]',
                  'focus-visible:outline-none focus-visible:ring-[var(--focus-ring-width)] focus-visible:ring-[var(--focus-ring-color)]',
                )}
              >
                <span className="inline-flex h-4 w-4 items-center justify-center text-[var(--text-tertiary)] group-hover:text-[var(--brand-600)] transition-colors">
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </a>
            ))}
          </div>
        </div>
      </StorefrontSection>
    )
  }

  return (
    <StorefrontSection spacing="compact" className={className} {...props}>
      <div className="grid grid-cols-4 gap-[var(--space-4)] md:grid-cols-8 md:gap-[var(--space-6)]">
        {items.map((item, index) => (
          <a
            key={index}
            href={item.href}
            className={cn(
              'group flex flex-col items-center gap-[var(--space-3)]',
              'transition-transform duration-[var(--motion-fast)] hover:-translate-y-0.5',
              'focus-visible:outline-none focus-visible:ring-[var(--focus-ring-width)] focus-visible:ring-[var(--focus-ring-color)] focus-visible:rounded-[var(--radius-lg)]',
            )}
          >
            <span
              className={cn(
                'flex items-center justify-center h-14 w-14 md:h-16 md:w-16 rounded-[var(--radius-xl)]',
                'bg-[var(--surface-muted)] text-[var(--text-secondary)]',
                'transition-[background-color,color,box-shadow] duration-[var(--motion-fast)]',
                'group-hover:bg-[var(--surface-base)] group-hover:text-[var(--brand-600)] group-hover:shadow-[var(--elevation-card)]',
              )}
            >
              <span className="block h-6 w-6 md:h-7 md:w-7">{item.icon}</span>
            </span>
            <span className="text-center text-[length:var(--text-xs)] md:text-[length:var(--text-sm)] font-medium text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors">
              {item.label}
            </span>
          </a>
        ))}
      </div>
    </StorefrontSection>
  )
}

export { QuickNavSection }
