export type ReviewStatus = 'PUBLISHED' | 'HIDDEN' | 'PENDING'
export type ReviewsStatusTab = 'ALL' | ReviewStatus
export type ReviewsReplyFilter = 'ALL' | 'HAS_REPLY' | 'NO_REPLY'

export interface ReviewRow {
  id: string
  rating: 1 | 2 | 3 | 4 | 5
  title: string | null
  comment: string | null
  status: ReviewStatus
  hasReply: boolean
  replyMessage: string | null
  createdAtLabel: string
}

export interface ReviewAnalytics {
  totalReviews: number
  averageRating: number
  ratingDistribution: { rating: number; count: number }[]
}

export interface ReviewsProps {
  title?: string
  description?: string
  rows?: ReviewRow[]
  analytics?: ReviewAnalytics
  loading?: boolean
  search?: string
  onSearchChange?: (v: string) => void
  status?: ReviewsStatusTab
  onStatusChange?: (v: ReviewsStatusTab) => void
  replyFilter?: ReviewsReplyFilter
  onReplyFilterChange?: (v: ReviewsReplyFilter) => void
  onReply?: (reviewId: string, message: string) => void | Promise<void>
  emptyMessage?: string
}
