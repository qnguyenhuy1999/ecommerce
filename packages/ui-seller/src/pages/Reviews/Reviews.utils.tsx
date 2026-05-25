import type { ReviewRow, ReviewsReplyFilter, ReviewsStatusTab } from './Reviews.types'

export interface ReviewsFilterParams {
  rows: ReviewRow[]
  search: string
  status: ReviewsStatusTab
  replyFilter: ReviewsReplyFilter
}

export function filterReviews({
  rows,
  search,
  status,
  replyFilter,
}: ReviewsFilterParams): ReviewRow[] {
  const query = search.trim().toLowerCase()

  return rows.filter((row) => {
    const matchesStatus = status === 'ALL' || row.status === status
    const matchesReply =
      replyFilter === 'ALL' ||
      (replyFilter === 'HAS_REPLY' && row.hasReply) ||
      (replyFilter === 'NO_REPLY' && !row.hasReply)
    const matchesSearch =
      query.length === 0 ||
      (row.title?.toLowerCase().includes(query) ?? false) ||
      (row.comment?.toLowerCase().includes(query) ?? false)

    return matchesStatus && matchesReply && matchesSearch
  })
}
