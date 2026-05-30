import {
  getReviewsBundle as getReviewsBundleBase,
  replyToReview,
} from '../integration/seller-page-api'

export async function getReviewsBundle(limit?: number, init?: RequestInit) {
  const bundle = await getReviewsBundleBase(limit, init)
  return {
    reviews: bundle.reviews.items,
    analytics: bundle.analytics,
  }
}

export { replyToReview }
