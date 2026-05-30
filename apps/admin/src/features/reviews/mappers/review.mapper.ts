import { formatDateIntl } from '@ecom/shared/utils/format'
import type { ReviewRecord } from '@ecom/ui-admin/pages/Reviews'
import type { ReviewListItem } from '../api/reviews.api'

function toCommentPreview(comment: string | null): string {
  if (!comment) return '—'
  return comment.length > 120 ? `${comment.slice(0, 120)}…` : comment
}

function toCreatedAtLabel(createdAt: string): string {
  return formatDateIntl(createdAt, { month: 'short', day: 'numeric', year: 'numeric' }, 'en-US')
}

export function mapReviewToRecord(item: ReviewListItem): ReviewRecord {
  return {
    id: item.id,
    rating: item.rating,
    commentPreview: toCommentPreview(item.comment),
    status: item.status,
    reportCount: item._count.reports,
    createdAtLabel: toCreatedAtLabel(item.createdAt),
  }
}

export function buildReviewStatusTabs(
  counts: Record<string, number>,
): { value: 'ALL' | ReviewRecord['status']; label: string; count: number }[] {
  const total = Object.values(counts).reduce((a, b) => a + b, 0)
  return [
    { value: 'ALL', label: 'All', count: total },
    { value: 'PENDING', label: 'Pending', count: counts['PENDING'] ?? 0 },
    { value: 'APPROVED', label: 'Approved', count: counts['APPROVED'] ?? 0 },
    { value: 'HIDDEN', label: 'Hidden', count: counts['HIDDEN'] ?? 0 },
    { value: 'REJECTED', label: 'Rejected', count: counts['REJECTED'] ?? 0 },
  ]
}
