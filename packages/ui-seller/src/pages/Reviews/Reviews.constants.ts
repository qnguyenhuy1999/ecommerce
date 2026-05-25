import type { ReviewStatus, ReviewsReplyFilter, ReviewsStatusTab } from './Reviews.types'

export const REVIEWS_STATUS_LABELS: Record<ReviewsStatusTab, string> = {
  ALL: 'All',
  PUBLISHED: 'Published',
  HIDDEN: 'Hidden',
  PENDING: 'Pending',
}

export const REVIEWS_STATUS_BADGE_STYLES: Record<ReviewStatus, string> = {
  PUBLISHED: 'bg-success/10 text-success',
  HIDDEN: 'bg-muted text-muted-foreground',
  PENDING: 'bg-warning/10 text-warning',
}

export const REVIEWS_REPLY_FILTER_LABELS: Record<ReviewsReplyFilter, string> = {
  ALL: 'All replies',
  HAS_REPLY: 'Replied',
  NO_REPLY: 'Not replied',
}

export const reviewsStatusTabs = [
  'ALL',
  'PUBLISHED',
  'HIDDEN',
  'PENDING',
] as const satisfies readonly ReviewsStatusTab[]
