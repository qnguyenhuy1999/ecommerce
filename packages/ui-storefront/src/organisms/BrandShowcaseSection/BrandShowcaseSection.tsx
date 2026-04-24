import { cn } from '@ecom/ui'
import { StorefrontSection } from '../../layouts/shared/StorefrontSection'

export interface Brand {
  name: string
  logo: string
  href: string
}

export interface BrandShowcaseSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  brands: Brand[]
}

function BrandShowcaseSection({ brands, className, ...props }: BrandShowcaseSectionProps) {
  if (brands.length === 0) return null

  return (
    <StorefrontSection className={cn('py-10', className)} {...props}>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
        {brands.map((brand, index) => (
          <a
            key={index}
            href={brand.href}
            title={brand.name}
            className={cn(
              'group relative flex items-center justify-center p-6 bg-background',
              'rounded-xl border border-border shadow-sm',
              'transition-all duration-[var(--motion-normal)] ease-[var(--motion-ease-out)]',
              'hover:shadow-[var(--elevation-floating)] hover:border-brand/30 hover:-translate-y-1',
            )}
          >
            <img
              src={brand.logo}
              alt={brand.name}
              className={cn(
                'max-w-[70%] max-h-12 object-contain',
                'filter grayscale opacity-60 transition-all duration-[var(--motion-normal)]',
                'group-hover:grayscale-0 group-hover:opacity-100',
              )}
              loading="lazy"
            />
          </a>
        ))}
      </div>
    </StorefrontSection>
  )
}

export { BrandShowcaseSection }
