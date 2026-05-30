'use client'

import { Reviews } from '@ecom/ui-seller/pages/Reviews'
import { useReviewsAdapter } from '@/features/reviews/hooks/use-reviews-adapter'

type ReviewsPageClientProps = { initialData?: Parameters<typeof useReviewsAdapter>[0] }

export function ReviewsPageClient({ initialData }: ReviewsPageClientProps) {
  const { loading, rows, analytics, onReply } = useReviewsAdapter(initialData)

  return (
    <Reviews
      rows={rows}
      {...(analytics !== undefined ? { analytics } : {})}
      loading={loading}
      onReply={onReply}
    />
  )
}
