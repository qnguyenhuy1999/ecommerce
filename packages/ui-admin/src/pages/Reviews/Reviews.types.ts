export const reviewStatuses = ['PENDING', 'APPROVED', 'HIDDEN', 'REJECTED'] as const
export type ReviewStatus = (typeof reviewStatuses)[number]
export type ReviewStatusTab = 'ALL' | ReviewStatus

export interface ReviewRecord {
  id: string
  rating: number
  commentPreview: string
  status: ReviewStatus
  reportCount: number
  createdAtLabel: string
}

export interface ReviewStatusTabOption {
  value: ReviewStatusTab
  label: string
  count: number
}

export interface ReviewsProps {
  title?: string
  description?: string
  searchPlaceholder?: string
  approveLabel?: string
  hideLabel?: string
  rejectLabel?: string
  emptyMessage?: string
  statusTabs?: ReviewStatusTabOption[]
  items?: ReviewRecord[]
  onApprove?: (item: ReviewRecord) => void
  onHide?: (item: ReviewRecord) => void
  onReject?: (item: ReviewRecord) => void
}
