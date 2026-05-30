import { headers } from 'next/headers'
import { getReviewsBundle } from '@/features/reviews/api'
import { mapReviewsToRows } from '@/features/reviews/mappers'
import { ReviewsPageClient } from './_components/ReviewsPage.client'

export default async function ReviewsPage() {
  const cookie = (await headers()).get('cookie')
  const init = { cache: 'no-store' as const, ...(cookie ? { headers: { cookie } } : {}) }
  const bundle = await getReviewsBundle(undefined, init)
  const initialData = {
    rows: mapReviewsToRows(bundle.reviews),
    analytics: bundle.analytics,
  }
  return <ReviewsPageClient initialData={initialData} />
}
