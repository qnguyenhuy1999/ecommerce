import { cn } from '@ecom/ui'

import { StorefrontSection } from '../../layouts/shared/StorefrontSection'

export interface QuickNavItem {
  icon: React.ReactNode
  label: string
  href: string
}

export interface QuickNavSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  items: QuickNavItem[]
}

function QuickNavSection({ items, className, ...props }: QuickNavSectionProps) {
  return (
    <StorefrontSection className={cn('pt-6 pb-2', className)} {...props}>
      <div className="grid grid-cols-4 md:grid-cols-8 gap-4 md:gap-6">
        {items.map((item, index) => (
          <a
            key={index}
            href={item.href}
            className={cn(
              'group flex flex-col items-center gap-3',
              'transition-transform duration-[var(--motion-fast)] hover:-translate-y-1',
            )}
          >
            <div
              className={cn(
                'flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-2xl',
                'bg-muted text-foreground/80 group-hover:text-brand',
                'shadow-[var(--elevation-sm)] transition-colors duration-[var(--motion-fast)]',
              )}
            >
              <div className="w-6 h-6 md:w-7 md:h-7">{item.icon}</div>
            </div>
            <span className="text-xs md:text-sm font-medium text-center text-foreground/80 group-hover:text-foreground transition-colors">
              {item.label}
            </span>
          </a>
        ))}
      </div>
    </StorefrontSection>
  )
}

export { QuickNavSection }
