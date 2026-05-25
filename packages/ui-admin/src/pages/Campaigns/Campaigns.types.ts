export const voucherStatuses = ['DRAFT', 'ACTIVE', 'PAUSED', 'EXPIRED'] as const

export type VoucherStatus = (typeof voucherStatuses)[number]

export interface VoucherRecord {
  id: string
  name: string
  type: string
  category: string
  dateRange: string
  status: VoucherStatus
  impressions: string
  ctr: string
  redemptions: string
  budgetSpent: string
  budgetTotal: string
  budgetPercent: number
}

export interface VouchersProps {
  title?: string
  description?: string
  newVoucherLabel?: string
  budgetLabel?: string
  editLabel?: string
  performanceLabel?: string
  impressionsLabel?: string
  ctrLabel?: string
  redemptionsLabel?: string
  tabLabels?: Partial<Record<VoucherStatus, string>>
  items?: VoucherRecord[]
  onNewVoucher?: (() => void | Promise<void>) | undefined
  onEdit?: ((item: VoucherRecord) => void | Promise<void>) | undefined
  onPerformance?: ((item: VoucherRecord) => void | Promise<void>) | undefined
}
