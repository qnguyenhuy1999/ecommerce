import { TrendingUp } from 'lucide-react'

import { cn } from '@ecom/ui'
import { StorefrontSection } from '../../layouts/shared/StorefrontSection'

export interface TrendingKeyword {
  label: string
  href: string
}

export interface TrendingSearchSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  keywords: TrendingKeyword[]
}

function TrendingSearchSection({ keywords, className, ...props }: TrendingSearchSectionProps) {
  if (keywords.length === 0) return null

  return (
    <StorefrontSection className={cn('py-8', className)} {...props}>
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 md:gap-6">
        <div className="flex items-center gap-2 shrink-0 text-foreground font-semibold">
          <TrendingUp className="w-5 h-5 text-brand" />
          <span>Trending Searches</span>
        </div>
        
        <div className="flex-1 overflow-x-auto pb-2 sm:pb-0 scrollbar-hide">
          <div className="flex flex-nowrap sm:flex-wrap items-center gap-2 md:gap-3 pr-4 sm:pr-0 min-w-max sm:min-w-0">
            {keywords.map((keyword, index) => (
              <a
                key={index}
                href={keyword.href}
                className={cn(
                  'px-4 py-2 bg-muted hover:bg-brand/10 text-muted-foreground hover:text-brand',
                  'rounded-full text-sm font-medium transition-colors whitespace-nowrap',
                  'border border-transparent hover:border-brand/20',
                )}
              >
                {keyword.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </StorefrontSection>
  )
}

export { TrendingSearchSection }
