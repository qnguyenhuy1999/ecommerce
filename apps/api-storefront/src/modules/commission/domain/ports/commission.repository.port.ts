import type { PayoutReportPage, SellerLedgerPage } from '../../application/views/commission.view'

export const COMMISSION_REPOSITORY = Symbol('COMMISSION_REPOSITORY')

export interface ListSellerLedgerInput {
  sellerId: string
  page: number
  limit: number
}

export interface AdminPayoutReportInput {
  page: number
  limit: number
  sellerId?: string
  from?: Date
  to?: Date
}

export interface ICommissionRepository {
  listSellerLedger(input: ListSellerLedgerInput): Promise<SellerLedgerPage>
  adminPayoutReport(input: AdminPayoutReportInput): Promise<PayoutReportPage>
}
