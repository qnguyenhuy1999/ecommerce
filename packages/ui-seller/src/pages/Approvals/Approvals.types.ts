export interface ApprovalRow {
  id: string
  productId: string
  status: string
  version: number
  rejectionReason: string | null
  createdAt: string
  reviewedAt: string | null
}

export interface ApprovalsProps {
  approvals?: ApprovalRow[]
  loading?: boolean
  onResubmit?: (approvalId: string) => Promise<void>
}
