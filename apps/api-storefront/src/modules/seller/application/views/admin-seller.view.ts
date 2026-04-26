import type { KycStatus } from '../../domain/entities/seller.entity'

export interface AdminSellerSummaryView {
  id: string
  userId: string
  storeName: string
  ownerEmail: string
  kycStatus: KycStatus
  commissionRate: number
  rating: number
  totalRatings: number
  submittedAt: string
}

export interface AdminSellerDetailView extends AdminSellerSummaryView {
  storeDescription: string | null
  businessRegistrationNumber: string | null
  bankAccountNumber: string | null
  bankCode: string | null
  kycDocuments: Record<string, unknown> | null
  updatedAt: string
}

export interface AdminSellerListInput {
  page: number
  limit: number
  kycStatus?: KycStatus
  search?: string
}

export interface AdminSellerListPage {
  data: AdminSellerSummaryView[]
  page: number
  limit: number
  total: number
  totalPages: number
}
