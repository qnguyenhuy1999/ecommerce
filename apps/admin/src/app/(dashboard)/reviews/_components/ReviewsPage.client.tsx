'use client'

import { Reviews } from '@ecom/ui-admin/pages/Reviews'
import { useReviewsAdapter } from '@/features/reviews/hooks/use-reviews-adapter'
import { stripAdapterMeta } from '@ecom/shared/utils/adapter-utils'

export function ReviewsPageClient() {
  return <Reviews {...stripAdapterMeta(useReviewsAdapter())} />
}
