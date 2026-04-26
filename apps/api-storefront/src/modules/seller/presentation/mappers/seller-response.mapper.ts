import type { KycStatus, SellerEntity } from '../../domain/entities/seller.entity'

export interface SellerResponseView {
  id: string
  userId: string
  storeName: string
  storeDescription: string | null
  kycStatus: KycStatus
  commissionRate: number
  rating: number
  totalRatings: number
  businessRegistrationNumber: string | null
  bankAccountNumber: string | null
  bankCode: string | null
  kycDocuments: Record<string, unknown> | null
  createdAt: string
  updatedAt: string
}

export interface SellerPublicView {
  id: string
  storeName: string
  storeDescription: string | null
  rating: number
  totalRatings: number
  createdAt: string
}

export function toSellerResponse(seller: SellerEntity): SellerResponseView {
  return {
    id: seller.props.id,
    userId: seller.props.userId,
    storeName: seller.props.storeName,
    storeDescription: seller.props.storeDescription,
    kycStatus: seller.props.kycStatus,
    commissionRate: seller.props.commissionRate,
    rating: seller.props.rating,
    totalRatings: seller.props.totalRatings,
    businessRegistrationNumber: seller.props.businessRegistrationNumber,
    bankAccountNumber: seller.props.bankAccountNumber,
    bankCode: seller.props.bankCode,
    kycDocuments: seller.props.kycDocuments,
    createdAt: seller.props.createdAt.toISOString(),
    updatedAt: seller.props.updatedAt.toISOString(),
  }
}

export function toSellerPublicView(seller: SellerEntity): SellerPublicView {
  return {
    id: seller.props.id,
    storeName: seller.props.storeName,
    storeDescription: seller.props.storeDescription,
    rating: seller.props.rating,
    totalRatings: seller.props.totalRatings,
    createdAt: seller.props.createdAt.toISOString(),
  }
}
