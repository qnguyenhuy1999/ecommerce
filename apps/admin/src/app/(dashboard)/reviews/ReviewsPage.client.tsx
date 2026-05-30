'use client'

import { Reviews } from '@ecom/ui-admin'
import { useReviewsAdapter } from '@/features/reviews/hooks/use-reviews-adapter'
import { stripAdapterMeta } from '@ecom/shared'

export function ReviewsPageClient() {
  return <Reviews {...stripAdapterMeta(useReviewsAdapter())} />
}
