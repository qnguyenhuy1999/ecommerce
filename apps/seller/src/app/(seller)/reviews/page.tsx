'use client'

import { Reviews } from '@ecom/ui-seller/pages/Reviews'
import { useReviewsAdapter } from '@/features/reviews/hooks/use-reviews-adapter'

export default function ReviewsPage() {
  const { loading, rows, analytics, onReply } = useReviewsAdapter()

  return (
    <Reviews
      rows={rows}
      {...(analytics !== undefined ? { analytics } : {})}
      loading={loading}
      onReply={onReply}
    />
  )
}
