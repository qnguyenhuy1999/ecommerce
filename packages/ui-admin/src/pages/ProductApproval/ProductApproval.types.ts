export type ProductApprovalStatus = 'PENDING' | 'REPORTED' | 'APPROVED' | 'REJECTED'
export type PendingAction = 'approve' | 'reject'

export interface ProductApprovalTag {
  id: string
  label: string
}

export interface ProductApprovalImage {
  id: string
  src: string
  alt: string
}

export interface ProductApprovalItem {
  id: string
  title: string
  sellerName: string
  submittedAtLabel: string
  priceLabel: string
  status: ProductApprovalStatus
  flagsLabel: string
  reasonTags: ProductApprovalTag[]
  stockLabel: string
  soldLabel: string
  ratingLabel: string
  images: ProductApprovalImage[]
}

export interface ProductApprovalActionPayload {
  ids: string[]
  reason: string
  action: 'approve' | 'reject'
}

export interface ProductApprovalStatusTab {
  value: ProductApprovalStatus
  label: string
  count: number
}

export type ProductApprovalStatusCounts = Record<ProductApprovalStatus, number>

export interface ProductApprovalProps {
  title?: string
  description?: string
  searchPlaceholder?: string
  approveLabel?: string
  rejectLabel?: string
  approveDialogTitle?: string
  approveDialogDescription?: string
  rejectDialogTitle?: string
  rejectDialogDescription?: string
  reasonLabel?: string
  reasonPlaceholder?: string
  reasonHint?: string
  items?: ProductApprovalItem[]
  statusTabs?: ProductApprovalStatusTab[]
  onApprove?: (payload: ProductApprovalActionPayload) => void | Promise<void>
  onReject?: (payload: ProductApprovalActionPayload) => void | Promise<void>
}

export interface ProductApprovalClientProps {
  searchPlaceholder: string
  approveLabel: string
  rejectLabel: string
  approveDialogTitle: string
  approveDialogDescription: string
  rejectDialogTitle: string
  rejectDialogDescription: string
  reasonLabel: string
  reasonPlaceholder: string
  reasonHint: string
  items: ProductApprovalItem[]
  statusTabs: ProductApprovalStatusTab[]
  onApprove?: ProductApprovalProps['onApprove']
  onReject?: ProductApprovalProps['onReject']
}

export interface ProductApprovalState {
  activeStatus: ProductApprovalStatus
  search: string
  selectedIds: string[]
  detailItemId: string | null
  sheetOpen: boolean
  pendingAction: PendingAction | null
  reason: string
  reasonError: string
  submitting: boolean
}
