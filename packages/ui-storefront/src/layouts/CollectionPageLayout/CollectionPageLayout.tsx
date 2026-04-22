import React from 'react'

import { cn } from '@ecom/ui'

import { StorefrontFooter } from '../StorefrontFooter/StorefrontFooter'
import { StorefrontHeader } from '../StorefrontHeader/StorefrontHeader'
import { StorefrontShell } from '../StorefrontShell/StorefrontShell'
import { StorefrontSection } from '../shared/StorefrontSection'
import { FilterSidebar } from '../../molecules/FilterSidebar/FilterSidebar'
import type { FilterGroupSpec } from '../../molecules/FilterSidebar/FilterSidebar'
import { NewsletterSignup } from '../../organisms/NewsletterSignup/NewsletterSignup'
import { ProductGrid } from '../../organisms/ProductGrid/ProductGrid'
import type { Product } from '../../organisms/ProductGrid/ProductGrid'

export interface CollectionPageLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  promoBar?: React.ReactNode
  header?: React.ReactNode
  footer?: React.ReactNode
  headerProps?: React.ComponentProps<typeof StorefrontHeader>
  footerProps?: React.ComponentProps<typeof StorefrontFooter>
  breadcrumb?: React.ReactNode
  title: string
  description?: string
  resultsLabel?: string
  filters: FilterGroupSpec[]
  onFilterChange?: (groupId: string, value: unknown) => void
  onClearAll?: () => void
  products: Product[]
  onAddToCart?: (id: string) => void
  loading?: boolean
  emptyMessage?: string
  aside?: React.ReactNode
  newsletter?: React.ReactNode
}

function CollectionPageLayout({
  promoBar,
  header,
  footer,
  headerProps,
  footerProps,
  breadcrumb,
  title,
  description,
  resultsLabel,
  filters,
  onFilterChange,
  onClearAll,
  products,
  onAddToCart,
  loading,
  emptyMessage,
  aside,
  newsletter,
  className,
  ...props
}: CollectionPageLayoutProps) {
  const resolvedResultsLabel = resultsLabel ?? `${products.length} products`

  return (
    <StorefrontShell
      className={className}
      header={
        header ?? (
          <div>
            {promoBar}
            <StorefrontHeader {...headerProps} />
          </div>
        )
      }
      footer={footer ?? <StorefrontFooter newsletter={newsletter} {...footerProps} />}
      {...props}
    >
      <StorefrontSection
        eyebrow="Collection"
        title={title}
        description={description}
        action={<p className="text-sm font-medium text-muted-foreground">{resolvedResultsLabel}</p>}
      >
        {breadcrumb && <div className="mb-6 text-sm text-muted-foreground">{breadcrumb}</div>}

        <div className="grid gap-8 lg:grid-cols-[20rem_minmax(0,1fr)] lg:items-start">
          <aside className="space-y-4 lg:sticky lg:top-28">
            <FilterSidebar groups={filters} onFilterChange={onFilterChange} onClearAll={onClearAll} />
            {aside}
          </aside>

          <div
            className={cn(
              'rounded-[var(--radius-2xl)] border border-border/70 bg-card p-5 shadow-[var(--elevation-card)]',
              'md:p-6',
            )}
          >
            <ProductGrid
              products={products}
              loading={loading}
              emptyMessage={emptyMessage}
              onAddToCart={onAddToCart}
            />
          </div>
        </div>
      </StorefrontSection>

      {newsletter && footer && (
        <StorefrontSection>
          {newsletter ?? <NewsletterSignup />}
        </StorefrontSection>
      )}
    </StorefrontShell>
  )
}

export { CollectionPageLayout }
