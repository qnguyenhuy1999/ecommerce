// ─── Seller / KYC Status ─────────────────────────────────────
export const KycStatus = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  REVISION: 'REVISION',
} as const
export type KycStatus = (typeof KycStatus)[keyof typeof KycStatus]

export const SellerStatus = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  SUSPENDED: 'SUSPENDED',
} as const
export type SellerStatus = (typeof SellerStatus)[keyof typeof SellerStatus]
