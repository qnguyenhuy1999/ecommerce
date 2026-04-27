'use client'

import React, { useMemo, useState } from 'react'

import { Star } from 'lucide-react'

import { cn } from '@ecom/ui'

import { Rating } from '../../atoms/Rating/Rating'
import type { ReviewCardProps } from '../ReviewCard/ReviewCard'
import { ReviewCard } from '../ReviewCard/ReviewCard'

// ─── Types ───────────────────────────────────────────────────────────────────
export type ReviewSortOption = 'latest' | 'highest' | 'lowest'

export interface ProductReviewsSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Array of reviews */
  reviews: ReviewCardProps[]
  /** Section id for scroll-to anchor */
  sectionId?: string
}

// ─── Rating Summary Bar ──────────────────────────────────────────────────────
interface RatingBarProps {
  stars: number
  count: number
  total: number
}

function RatingBar({ stars, count, total }: RatingBarProps) {
  const percent = total > 0 ? (count / total) * 100 : 0

  return (
    <div className="flex items-center gap-2.5 text-sm">
      <span className="flex items-center gap-1 w-8 shrink-0 text-muted-foreground font-medium tabular-nums">
        {stars}
        <Star className="w-3 h-3 fill-current text-[var(--color-rating-star)]" />
      </span>
      <div className="flex-1 h-2 rounded-full bg-muted/50 overflow-hidden">
        <div
          className={cn(
            'h-full rounded-full transition-all duration-500 ease-out',
            stars >= 4
              ? 'bg-[var(--color-rating-star)]'
              : stars === 3
                ? 'bg-[var(--intent-warning)]'
                : 'bg-[var(--intent-warning)]/60',
          )}
          style={{ width: `${percent}%` }}
        />
      </div>
      <span className="w-8 text-right text-xs text-muted-foreground tabular-nums">{count}</span>
    </div>
  )
}

// ─── Sort Tabs ───────────────────────────────────────────────────────────────
interface ReviewSortTabsProps {
  value: ReviewSortOption
  onChange: (value: ReviewSortOption) => void
}

const sortOptions: { value: ReviewSortOption; label: string }[] = [
  { value: 'latest', label: 'Latest' },
  { value: 'highest', label: 'Highest' },
  { value: 'lowest', label: 'Lowest' },
]

function ReviewSortTabs({ value, onChange }: ReviewSortTabsProps) {
  return (
    <div className="flex items-center gap-1 rounded-[var(--radius-lg)] bg-muted/50 p-1">
      {sortOptions.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={cn(
            'px-3 py-1.5 text-xs font-medium rounded-[var(--radius-md)] transition-all duration-200',
            value === option.value
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground',
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}

// ─── Main Component ──────────────────────────────────────────────────────────
function ProductReviewsSection({
  reviews,
  sectionId = 'product-reviews',
  className,
  ...props
}: ProductReviewsSectionProps) {
  const [sortBy, setSortBy] = useState<ReviewSortOption>('latest')

  // Calculate rating summary
  const summary = useMemo(() => {
    if (reviews.length === 0) return null

    const total = reviews.length
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0)
    const average = sum / total

    // Count by star level
    const breakdown = [5, 4, 3, 2, 1].map((stars) => ({
      stars,
      count: reviews.filter((r) => Math.floor(r.rating) === stars).length,
    }))

    return { average, total, breakdown }
  }, [reviews])

  // Sort reviews
  const sortedReviews = useMemo(() => {
    const sorted = [...reviews]
    switch (sortBy) {
      case 'highest':
        sorted.sort((a, b) => b.rating - a.rating)
        break
      case 'lowest':
        sorted.sort((a, b) => a.rating - b.rating)
        break
      case 'latest':
      default:
        // Keep original order (assumed to be latest first)
        break
    }
    return sorted
  }, [reviews, sortBy])

  if (reviews.length === 0) return null

  return (
    <div id={sectionId} className={cn('space-y-8', className)} {...props}>
      {/* Rating Summary + Sort Controls */}
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        {/* Summary */}
        {summary && (
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-10">
            {/* Average score */}
            <div className="flex flex-col items-center gap-2 shrink-0">
              <span className="text-5xl font-bold tracking-tight text-foreground tabular-nums">
                {summary.average.toFixed(1)}
              </span>
              <Rating value={summary.average} size="default" />
              <span className="text-xs text-muted-foreground font-medium">
                {summary.total.toLocaleString()} reviews
              </span>
            </div>

            {/* Star breakdown */}
            <div className="flex-1 min-w-[12.5rem] max-w-xs space-y-1.5">
              {summary.breakdown.map((item) => (
                <RatingBar
                  key={item.stars}
                  stars={item.stars}
                  count={item.count}
                  total={summary.total}
                />
              ))}
            </div>
          </div>
        )}

        {/* Sort */}
        <ReviewSortTabs value={sortBy} onChange={setSortBy} />
      </div>

      {/* Review Cards */}
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {sortedReviews.map((review, index) => (
          <ReviewCard key={`${review.author}-${index}`} {...review} />
        ))}
      </div>
    </div>
  )
}

export { ProductReviewsSection }
