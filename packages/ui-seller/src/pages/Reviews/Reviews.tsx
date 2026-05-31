import { Card, CardContent, CardHeader, CardTitle } from '@ecom/core-ui/molecules/Card'
import { SellerListPage } from '../../organisms/SellerListPage'
import { ReviewsClient } from './Reviews.client'
import { reviewsAnalytics, reviewsPageRows } from './Reviews.fixtures'
import type { ReviewAnalytics, ReviewsProps } from './Reviews.types'

interface ReviewsAnalyticsProps {
  analytics: ReviewAnalytics
}

function ReviewsStatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="text-muted-foreground text-sm">{label}</div>
        <div className="text-foreground mt-1 text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  )
}

function ReviewsDistributionCard({ analytics }: ReviewsAnalyticsProps) {
  const max = Math.max(...analytics.ratingDistribution.map((item) => item.count), 1)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">Rating Distribution</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {[...analytics.ratingDistribution]
          .sort((a, b) => b.rating - a.rating)
          .map((item) => {
            const percentage = (item.count / max) * 100

            return (
              <div key={item.rating} className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground w-6 text-right">{item.rating}★</span>
                <div
                  className="bg-muted h-2 flex-1 overflow-hidden rounded-full"
                  aria-label={`${item.rating} star reviews: ${item.count}`}
                  role="meter"
                  aria-valuemin={0}
                  aria-valuemax={max}
                  aria-valuenow={item.count}
                >
                  <div
                    className="h-2 rounded-full bg-yellow-400"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="text-muted-foreground w-6">{item.count}</span>
              </div>
            )
          })}
      </CardContent>
    </Card>
  )
}

function ReviewsAnalyticsSummary({ analytics }: ReviewsAnalyticsProps) {
  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-3" aria-label="Reviews analytics">
      <ReviewsStatCard label="Total Reviews" value={analytics.totalReviews} />
      <ReviewsStatCard label="Average Rating" value={analytics.averageRating.toFixed(1)} />
      <ReviewsDistributionCard analytics={analytics} />
    </section>
  )
}

export function Reviews({
  title = 'Reviews',
  description = 'Manage customer reviews for your shop',
  rows = reviewsPageRows,
  analytics = reviewsAnalytics,
  loading = false,
  search,
  onSearchChange,
  status,
  onStatusChange,
  replyFilter,
  onReplyFilterChange,
  onReply,
  emptyMessage = 'No reviews yet',
}: ReviewsProps) {
  const normalizedRows = rows ?? []
  const normalizedAnalytics = analytics ?? reviewsAnalytics
  const isLoading = loading ?? false

  return (
    <SellerListPage title={title} description={description}>
      <ReviewsAnalyticsSummary analytics={normalizedAnalytics} />
      <ReviewsClient
        rows={normalizedRows}
        loading={isLoading}
        search={search}
        onSearchChange={onSearchChange}
        status={status}
        onStatusChange={onStatusChange}
        replyFilter={replyFilter}
        onReplyFilterChange={onReplyFilterChange}
        onReply={onReply}
        emptyMessage={emptyMessage}
      />
    </SellerListPage>
  )
}
