import {
  getReviewsBundle as getReviewsBundleBase,
  replyToReview,
} from '../integration/seller-page-api'

export async function getReviewsBundle(limit?: number) {
  const bundle = await getReviewsBundleBase(limit)
  return {
    reviews: bundle.reviews.items,
    analytics: bundle.analytics,
  }
}

export { replyToReview }
