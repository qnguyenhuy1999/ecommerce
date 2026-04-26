export interface SellerLedgerView {
  id: string
  type: 'CREDIT' | 'DEBIT'
  amount: number
  referenceType: string | null
  referenceId: string | null
  description: string | null
  createdAt: string
}

export interface SellerLedgerPage {
  data: SellerLedgerView[]
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface PayoutReportRow {
  commissionId: string
  orderId: string
  sellerId: string
  storeName: string
  amount: number
  rate: number
  createdAt: string
}

export interface PayoutReportPage {
  data: PayoutReportRow[]
  page: number
  limit: number
  total: number
  totalPages: number
}
