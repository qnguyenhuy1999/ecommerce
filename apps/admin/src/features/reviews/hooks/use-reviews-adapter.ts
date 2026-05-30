'use client'

import type { ReviewRecord, ReviewsProps } from '@ecom/ui-admin/pages/Reviews'
import { PAGINATION_DEFAULTS } from '@ecom/shared/pagination/core'
import {
  useReviews,
  useReviewStatusCounts,
  useApproveReview,
  useHideReview,
  useRejectReview,
} from '../hooks/use-reviews'
import { mapReviewToRecord, buildReviewStatusTabs } from '../mappers/review.mapper'

export function useReviewsAdapter(): ReviewsProps & { loading: boolean; error: Error | null } {
  const reviewsQuery = useReviews({ page: 1, limit: PAGINATION_DEFAULTS.PAGE_SIZE })
  const countsQuery = useReviewStatusCounts()
  const approveMutation = useApproveReview()
  const hideMutation = useHideReview()
  const rejectMutation = useRejectReview()

  return {
    loading: reviewsQuery.isPending,
    error: reviewsQuery.error,
    items: (reviewsQuery.data?.items ?? []).map(mapReviewToRecord),
    statusTabs: buildReviewStatusTabs(countsQuery.data ?? {}),
    onApprove: (item: ReviewRecord) => approveMutation.mutate(item.id),
    onHide: (item: ReviewRecord) => hideMutation.mutate(item.id),
    onReject: (item: ReviewRecord) => rejectMutation.mutate(item.id),
  }
}
