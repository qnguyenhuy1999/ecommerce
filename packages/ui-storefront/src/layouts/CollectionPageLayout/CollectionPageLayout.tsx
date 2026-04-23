import React from 'react'


import { StorefrontFooter } from '../StorefrontFooter/StorefrontFooter'
import { StorefrontHeader } from '../StorefrontHeader/StorefrontHeader'
import { StorefrontShell } from '../StorefrontShell/StorefrontShell'
import { StorefrontSection } from '../shared/StorefrontSection'
import { FilterSidebar } from '../../molecules/FilterSidebar/FilterSidebar'
import type { FilterGroupSpec } from '../../molecules/FilterSidebar/FilterSidebar'

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
  aside?: React.ReactNode
  grid: React.ReactNode
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
  aside,
  grid,
  newsletter,
  className,
  ...props
}: CollectionPageLayoutProps) {
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
        action={
          resultsLabel ? (
            <p className="text-sm font-medium text-muted-foreground">{resultsLabel}</p>
          ) : undefined
        }
      >
        {breadcrumb && <div className="mb-6 text-sm text-muted-foreground">{breadcrumb}</div>}

        <div className="grid gap-8 lg:grid-cols-[20rem_minmax(0,1fr)] lg:items-start">
          <aside className="space-y-4 lg:sticky lg:top-28">
            <FilterSidebar
              groups={filters}
              onFilterChange={onFilterChange}
              onClearAll={onClearAll}
            />
            {aside}
          </aside>

          {grid}
        </div>
      </StorefrontSection>
    </StorefrontShell>
  )
}

export { CollectionPageLayout }
