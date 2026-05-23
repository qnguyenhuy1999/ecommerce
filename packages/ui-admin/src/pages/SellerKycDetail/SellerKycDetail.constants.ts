import type { SellerKycDetailStatus } from './SellerKycDetail.types'

export function getStatusTone(status: SellerKycDetailStatus): 'approved' | 'warning' | 'rejected' {
  switch (status) {
    case 'APPROVED':
      return 'approved'
    case 'REJECTED':
      return 'rejected'
    case 'PENDING':
    default:
      return 'warning'
  }
}

export const PLACEHOLDER_CONTENT = {
  VIOLATIONS: {
    title: 'Violations',
    message: 'No active policy violations found for this seller.',
  },
  PROFILE: {
    title: 'Seller profile',
    message: 'Profile summary stays package-local until admin route wiring lands.',
  },
} as const satisfies Record<string, { title: string; message: string }>
