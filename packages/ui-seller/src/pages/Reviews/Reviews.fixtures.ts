import type { ReviewAnalytics, ReviewRow } from './Reviews.types'

export const reviewsPageRows: ReviewRow[] = [
  {
    id: 'rev-001',
    rating: 5,
    title: 'Amazing quality!',
    comment: 'Absolutely love this product. Fast shipping and great packaging.',
    status: 'PUBLISHED',
    hasReply: true,
    replyMessage: 'Thank you so much for your kind words!',
    createdAtLabel: 'May 20, 2026',
  },
  {
    id: 'rev-002',
    rating: 4,
    title: 'Good value',
    comment: 'Works as described. Minor cosmetic issue but nothing major.',
    status: 'PUBLISHED',
    hasReply: false,
    replyMessage: null,
    createdAtLabel: 'May 18, 2026',
  },
  {
    id: 'rev-003',
    rating: 2,
    title: 'Not what I expected',
    comment: 'The color was different from the photos. Disappointed.',
    status: 'PENDING',
    hasReply: false,
    replyMessage: null,
    createdAtLabel: 'May 15, 2026',
  },
  {
    id: 'rev-004',
    rating: 5,
    title: null,
    comment: 'Perfect! Will order again.',
    status: 'PUBLISHED',
    hasReply: true,
    replyMessage: 'We appreciate your support!',
    createdAtLabel: 'May 12, 2026',
  },
  {
    id: 'rev-005',
    rating: 1,
    title: 'Broken on arrival',
    comment: 'Item arrived damaged. Very disappointed with the packaging.',
    status: 'HIDDEN',
    hasReply: false,
    replyMessage: null,
    createdAtLabel: 'May 10, 2026',
  },
]

export const reviewsAnalytics: ReviewAnalytics = {
  totalReviews: 128,
  averageRating: 4.2,
  ratingDistribution: [
    { rating: 5, count: 72 },
    { rating: 4, count: 28 },
    { rating: 3, count: 14 },
    { rating: 2, count: 8 },
    { rating: 1, count: 6 },
  ],
}
