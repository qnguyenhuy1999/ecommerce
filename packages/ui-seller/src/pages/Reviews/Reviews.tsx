import { SellerListPage } from '../../organisms/SellerListPage'
import { ReviewsClient } from './Reviews.client'
import { reviewsAnalytics, reviewsPageRows } from './Reviews.fixtures'
import type { ReviewsProps } from './Reviews.types'

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
  return (
    <SellerListPage title={title} description={description}>
      <ReviewsClient
        rows={rows}
        analytics={analytics}
        loading={loading}
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
