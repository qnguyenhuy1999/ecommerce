'use client'

import React from 'react'

import { ListFilter, X } from 'lucide-react'

import { Button, Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, cn } from '@ecom/ui'

import { FilterSidebar } from '../../molecules/FilterSidebar/FilterSidebar'
import type { FilterGroupSpec } from '../../molecules/FilterSidebar/FilterSidebar'
import { PageContainer } from '../shared/PageContainer'
import { StorefrontPageShell } from '../shared/StorefrontPageShell'
import type { StorefrontFooter } from '../StorefrontFooter/StorefrontFooter'
import type { StorefrontHeader } from '../StorefrontHeader/StorefrontHeader'

export interface CollectionPageLayoutProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'title'
> {
  promoBar?: React.ReactNode
  header?: React.ReactNode
  footer?: React.ReactNode
  headerProps?: React.ComponentProps<typeof StorefrontHeader>
  footerProps?: React.ComponentProps<typeof StorefrontFooter>
  breadcrumb?: React.ReactNode
  title: React.ReactNode
  description?: React.ReactNode
  /** e.g. "1,248 results" — shown in the hero meta strip and as the mobile drawer subtitle. */
  resultsLabel?: string
  /** Optional emotional/visual element placed beside the title (image, illustration, badge cluster). */
  heroAccent?: React.ReactNode
  /**
   * Full-width content rendered below the title cluster in the hero band — used for
   * page-specific overlays like a persistent search refinement bar on the search
   * results page. Renders on all breakpoints (unlike heroAccent, which is desktop-only).
   */
  headerExtras?: React.ReactNode
  filters: FilterGroupSpec[]
  onFilterChange?: (groupId: string, value: unknown) => void
  onClearAll?: () => void
  /** Optional content rendered below the filter list in the sidebar (e.g. promotions, recently viewed). */
  aside?: React.ReactNode
  grid: React.ReactNode
  newsletter?: React.ReactNode
  /**
   * Toolbar shown above the grid — sort dropdown, view toggle, active filter chips, etc.
   * Rendered without a heavy boxed surface so it sits cleanly against the page.
   */
  discoveryToolbar?: React.ReactNode
}

function CollectionHero({
  breadcrumb,
  title,
  description,
  resultsLabel,
  heroAccent,
  headerExtras,
}: Pick<
  CollectionPageLayoutProps,
  'breadcrumb' | 'title' | 'description' | 'resultsLabel' | 'heroAccent' | 'headerExtras'
>) {
  return (
    <section className="border-b border-[var(--border-subtle)] bg-[var(--surface-subtle)]">
      <PageContainer>
        {breadcrumb && (
          <div className="mb-3 text-[length:var(--text-xs)] text-[var(--text-tertiary)]">
            {breadcrumb}
          </div>
        )}

        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between md:gap-8">
          <div className="min-w-0 flex-1">
            <h1
              className={cn(
                'text-[length:var(--font-size-heading-xl)] font-bold tracking-[-0.02em]',
                'leading-[var(--line-height-tight)] text-[var(--text-primary)]',
                'sm:text-[length:var(--font-size-display-sm)]',
              )}
            >
              {title}
            </h1>
            {description && (
              <p
                className={cn(
                  'mt-2 max-w-[60ch]',
                  'text-[length:var(--text-base)] leading-[var(--line-height-relaxed)] text-[var(--text-secondary)]',
                )}
              >
                {description}
              </p>
            )}
            {resultsLabel && (
              <p className="mt-3 text-sm font-medium text-[var(--text-tertiary)]">{resultsLabel}</p>
            )}
          </div>

          {heroAccent && (
            <div className="hidden md:flex md:shrink-0 md:items-center md:justify-end">
              {heroAccent}
            </div>
          )}
        </div>

        {headerExtras && <div className="mt-5">{headerExtras}</div>}
      </PageContainer>
    </section>
  )
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
  heroAccent,
  headerExtras,
  filters,
  onFilterChange,
  onClearAll,
  aside,
  grid,
  newsletter,
  discoveryToolbar,
  className,
  ...props
}: CollectionPageLayoutProps) {
  const [drawerOpen, setDrawerOpen] = React.useState(false)

  const sidebar = (
    <>
      <FilterSidebar groups={filters} onFilterChange={onFilterChange} onClearAll={onClearAll} />
      {aside && <div className="mt-6 border-t border-[var(--border-subtle)] pt-6">{aside}</div>}
    </>
  )

  return (
    <StorefrontPageShell
      className={className}
      promoBar={promoBar}
      header={header}
      footer={footer}
      headerProps={headerProps}
      footerProps={footerProps}
      newsletter={newsletter}
      {...props}
    >
      <CollectionHero
        breadcrumb={breadcrumb}
        title={title}
        description={description}
        resultsLabel={resultsLabel}
        heroAccent={heroAccent}
        headerExtras={headerExtras}
      />

      <PageContainer>
        {/* Mobile filter trigger — hidden on lg+ where the sidebar is visible */}
        <div className="mb-4 flex items-center justify-between gap-3 lg:hidden">
          <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
            <SheetTrigger asChild>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="gap-2 rounded-[var(--radius-lg)]"
              >
                <ListFilter className="h-4 w-4" aria-hidden="true" />
                Filters
              </Button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="w-full max-w-sm overflow-y-auto bg-[var(--surface-base)] p-0"
            >
              <SheetHeader
                className={cn(
                  'sticky top-0 z-10 flex flex-row items-center justify-between gap-2',
                  'border-b border-[var(--border-subtle)] bg-[var(--surface-base)]',
                  'px-5 py-4',
                )}
              >
                <div className="text-left">
                  <SheetTitle className="text-[length:var(--text-base)] font-semibold text-[var(--text-primary)]">
                    Filters
                  </SheetTitle>
                  {resultsLabel && (
                    <p className="mt-0.5 text-[length:var(--text-xs)] text-[var(--text-tertiary)]">
                      {resultsLabel}
                    </p>
                  )}
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setDrawerOpen(false)}
                  aria-label="Close filters"
                  className="h-8 w-8 px-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </SheetHeader>
              <div className="px-5 pb-8 pt-2">{sidebar}</div>
              <div
                className={cn(
                  'sticky bottom-0 border-t border-[var(--border-subtle)] bg-[var(--surface-base)]',
                  'px-5 py-3',
                )}
              >
                <Button
                  type="button"
                  size="lg"
                  onClick={() => setDrawerOpen(false)}
                  className="w-full rounded-[var(--radius-lg)]"
                >
                  Show results
                </Button>
              </div>
            </SheetContent>
          </Sheet>

          {resultsLabel && (
            <p className="text-[length:var(--text-xs)] text-[var(--text-tertiary)]">
              {resultsLabel}
            </p>
          )}
        </div>

        <div className="grid gap-8 lg:grid-cols-[16rem_minmax(0,1fr)] lg:items-start lg:gap-10">
          {/* Desktop sidebar — sticky offset uses the measured total header
              height (`--storefront-header-total`) so the sidebar never hides
              behind the optional category nav row. Falls back to the bare
              header height before the shell finishes measuring. */}
          <aside
            className={cn(
              'hidden lg:block',
              'lg:sticky lg:top-[calc(var(--storefront-header-total)+var(--space-6))]',
              'lg:max-h-[calc(100vh-var(--storefront-header-total)-var(--space-12))] lg:overflow-y-auto',
              'lg:pr-2',
            )}
          >
            {sidebar}
          </aside>

          {/* Grid + toolbar */}
          <div className="min-w-0 space-y-5">
            {discoveryToolbar && (
              <div
                className={cn(
                  'flex flex-wrap items-center justify-between gap-3',
                  'pb-4',
                  'border-b border-[var(--border-subtle)]',
                )}
              >
                {discoveryToolbar}
              </div>
            )}
            {grid}
          </div>
        </div>
      </PageContainer>
    </StorefrontPageShell>
  )
}

export { CollectionPageLayout }
