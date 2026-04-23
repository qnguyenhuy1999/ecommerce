import { cn } from '@ecom/ui'
import { TrustBadgeGroup, TrustBadgeType } from '../../atoms/TrustBadge/TrustBadge'

export interface TrustBannerSectionProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  badges?: TrustBadgeType[]
}

function TrustBannerSection({
  badges = ['authentic', 'free-shipping', 'free-returns', 'secure-checkout'],
  className,
  ...props
}: TrustBannerSectionProps) {
  return (
    <div className={cn('w-full border-y border-border/60 bg-muted/30', className)} {...props}>
      <div className="max-w-[var(--storefront-content-max-width)] mx-auto px-4 md:px-8 py-3">
        <TrustBadgeGroup
          types={badges}
          size="sm"
          separator="pipe"
          className="justify-center sm:justify-start overflow-x-auto whitespace-nowrap scrollbar-hide py-1 flex-nowrap md:flex-wrap"
        />
      </div>
    </div>
  )
}

export { TrustBannerSection }
