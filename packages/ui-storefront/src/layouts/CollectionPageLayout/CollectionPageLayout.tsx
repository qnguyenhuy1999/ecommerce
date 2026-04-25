'use client'

import React from 'react'

import { ListFilter, X } from 'lucide-react'

import {
  Button,
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  cn,
} from '@ecom/ui'

import { FilterSidebar } from '../../molecules/FilterSidebar/FilterSidebar'
import type { FilterGroupSpec } from '../../molecules/FilterSidebar/FilterSidebar'
import { StorefrontFooter } from '../StorefrontFooter/StorefrontFooter'
import { StorefrontHeader } from '../StorefrontHeader/StorefrontHeader'
import { StorefrontShell } from '../StorefrontShell/StorefrontShell'

export interface CollectionPageLayoutProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
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
      <FilterSidebar
        groups={filters}
        onFilterChange={onFilterChange}
        onClearAll={onClearAll}
      />
      {aside && (
        <div className="mt-[var(--space-6)] border-t border-[var(--border-subtle)] pt-[var(--space-6)]">
          {aside}
        </div>
      )}
    </>
  )

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
      {/* HERO HEADER — subtle band, never overpowering */}
      <section className="border-b border-[var(--border-subtle)] bg-[var(--surface-subtle)]">
        <div
          className={cn(
            'mx-auto w-full max-w-[var(--storefront-content-max-width)]',
            'px-[var(--space-4)] sm:px-[var(--space-6)] lg:px-[var(--space-8)]',
            'py-[var(--space-8)] lg:py-[var(--space-12)]',
          )}
        >
          {breadcrumb && (
            <div className="mb-[var(--space-3)] text-[length:var(--text-xs)] text-[var(--text-tertiary)]">
              {breadcrumb}
            </div>
          )}

          <div className="flex flex-col gap-[var(--space-4)] md:flex-row md:items-end md:justify-between md:gap-[var(--space-8)]">
            <div className="min-w-0 flex-1">
              <h1
                className={cn(
                  'text-[length:var(--font-size-heading-xl)] font-bold tracking-[-0.02em] leading-[var(--line-height-tight)] text-[var(--text-primary)]',
                  'sm:text-[length:var(--font-size-display-sm)]',
                )}
              >
                {title}
              </h1>
              {description && (
                <p
                  className={cn(
                    'mt-[var(--space-2)] max-w-[60ch]',
                    'text-[length:var(--text-base)] leading-[var(--line-height-relaxed)] text-[var(--text-secondary)]',
                  )}
                >
                  {description}
                </p>
              )}
              {resultsLabel && (
                <p className="mt-[var(--space-3)] text-[length:var(--text-sm)] font-medium text-[var(--text-tertiary)]">
                  {resultsLabel}
                </p>
              )}
            </div>

            {heroAccent && (
              <div className="hidden md:flex md:shrink-0 md:items-center md:justify-end">
                {heroAccent}
              </div>
            )}
          </div>

          {headerExtras && <div className="mt-[var(--space-5)]">{headerExtras}</div>}
        </div>
      </section>

      {/* MAIN — sidebar + grid */}
      <div
        className={cn(
          'mx-auto w-full max-w-[var(--storefront-content-max-width)]',
          'px-[var(--space-4)] sm:px-[var(--space-6)] lg:px-[var(--space-8)]',
          'py-[var(--space-8)] lg:py-[var(--space-12)]',
        )}
      >
        {/* Mobile filter trigger — hidden on lg+ where the sidebar is visible */}
        <div className="mb-[var(--space-4)] flex items-center justify-between gap-[var(--space-3)] lg:hidden">
          <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
            <SheetTrigger asChild>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="gap-[var(--space-2)] rounded-[var(--radius-lg)]"
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
                  'sticky top-0 z-10 flex flex-row items-center justify-between gap-[var(--space-2)]',
                  'border-b border-[var(--border-subtle)] bg-[var(--surface-base)]',
                  'px-[var(--space-5)] py-[var(--space-4)]',
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
                  size="icon-sm"
                  onClick={() => setDrawerOpen(false)}
                  aria-label="Close filters"
                >
                  <X className="h-4 w-4" />
                </Button>
              </SheetHeader>
              <div className="px-[var(--space-5)] pb-[var(--space-8)] pt-[var(--space-2)]">
                {sidebar}
              </div>
              <div
                className={cn(
                  'sticky bottom-0 border-t border-[var(--border-subtle)] bg-[var(--surface-base)]',
                  'px-[var(--space-5)] py-[var(--space-3)]',
                )}
              >
                <Button
                  type="button"
                  fullWidth
                  size="lg"
                  onClick={() => setDrawerOpen(false)}
                  className="rounded-[var(--radius-lg)]"
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

        <div className="grid gap-[var(--space-8)] lg:grid-cols-[16rem_minmax(0,1fr)] lg:items-start lg:gap-[var(--space-10)]">
          {/* Desktop sidebar — sticky, lightweight, no heavy box */}
          <aside
            className={cn(
              'hidden lg:block',
              'lg:sticky lg:top-[calc(var(--storefront-header-height)+var(--space-6))]',
              'lg:max-h-[calc(100vh-var(--storefront-header-height)-var(--space-12))] lg:overflow-y-auto',
              'lg:pr-[var(--space-2)]',
            )}
          >
            {sidebar}
          </aside>

          {/* Grid + toolbar */}
          <div className="min-w-0 space-y-[var(--space-5)]">
            {discoveryToolbar && (
              <div
                className={cn(
                  'flex flex-wrap items-center justify-between gap-[var(--space-3)]',
                  'pb-[var(--space-4)]',
                  'border-b border-[var(--border-subtle)]',
                )}
              >
                {discoveryToolbar}
              </div>
            )}
            {grid}
          </div>
        </div>
      </div>
    </StorefrontShell>
  )
}

export { CollectionPageLayout }
