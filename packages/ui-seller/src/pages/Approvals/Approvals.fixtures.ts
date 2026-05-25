import type { ApprovalsProps } from './Approvals.types'

export const defaultProps = {
  onResubmit: undefined,
} satisfies ApprovalsProps

export const mockApprovals = [
  {
    id: '1',
    productId: 'prod-aaa-111',
    status: 'PENDING_REVIEW',
    version: 1,
    rejectionReason: null,
    createdAt: '2025-05-01T00:00:00Z',
    reviewedAt: null,
  },
  {
    id: '2',
    productId: 'prod-bbb-222',
    status: 'REJECTED',
    version: 2,
    rejectionReason: 'Missing images',
    createdAt: '2025-04-20T00:00:00Z',
    reviewedAt: '2025-04-22T00:00:00Z',
  },
]
