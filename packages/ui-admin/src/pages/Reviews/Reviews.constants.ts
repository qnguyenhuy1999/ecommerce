import type { ReviewStatus, ReviewsProps } from './Reviews.types'

export const REVIEWS_STATUS_TAB_ORDER: Array<'ALL' | ReviewStatus> = [
  'ALL',
  'PENDING',
  'APPROVED',
  'HIDDEN',
  'REJECTED',
] as const

export function buildReviewStatusCounts(
  statusTabs: NonNullable<ReviewsProps['statusTabs']>,
): Record<string, number> {
  return statusTabs.reduce<Record<string, number>>((accumulator, tab) => {
    accumulator[tab.value] = tab.count
    return accumulator
  }, {})
}
