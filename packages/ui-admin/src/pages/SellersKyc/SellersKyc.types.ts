import type { ReactNode } from 'react'

export type SellerKycStatus = 'PENDING' | 'APPROVED' | 'SUSPENDED'
export type SellerKycStatusTab = 'ALL' | SellerKycStatus

export interface SellerKycRow {
  id: string
  vendorName: string
  vendorEmail: string
  ownerName: string
  category: string
  productsCount: number
  gmv: number
  appliedAtLabel: string
  status: SellerKycStatus
}

export interface SellerKycStatusTabOption {
  value: SellerKycStatusTab
  label: string
  count: number
}

export type SellerKycStatusCounts = Record<SellerKycStatusTab, number>

export interface SellerKycProps {
  title?: string
  description?: string
  awaitingReviewLabel?: string
  searchPlaceholder?: string
  reviewLabel?: string
  emptyMessage?: string
  statusTabs?: SellerKycStatusTabOption[]
  items?: SellerKycRow[]
  onReview?: (item: SellerKycRow) => void
}

export interface SellerKycClientProps {
  searchPlaceholder: string
  reviewLabel: string
  emptyMessage: string
  statusTabs: SellerKycStatusTabOption[]
  items: SellerKycRow[]
  onReview?: SellerKycProps['onReview']
}

export interface SellerKycColumn {
  id: string
  label: string
  headerClassName?: string
  cellClassName?: string
  render: (item: SellerKycRow) => ReactNode
}
