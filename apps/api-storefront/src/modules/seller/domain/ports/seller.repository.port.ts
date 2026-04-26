import type { KycStatus, SellerEntity } from '../entities/seller.entity'

export const SELLER_REPOSITORY = Symbol('SELLER_REPOSITORY')

export interface SellerCreateInput {
  userId: string
  storeName: string
  storeDescription?: string | null
  businessRegistrationNumber?: string | null
  bankAccountNumber?: string | null
  bankCode?: string | null
  kycDocuments?: Record<string, unknown> | null
}

export interface SellerUpdateInput {
  storeName?: string
  storeDescription?: string | null
  businessRegistrationNumber?: string | null
  bankAccountNumber?: string | null
  bankCode?: string | null
  kycDocuments?: Record<string, unknown> | null
}

export interface SellerKycTransitionInput {
  sellerId: string
  fromStatus: KycStatus
  toStatus: KycStatus
  adminUserId: string
  reason?: string | null
}

export interface ISellerRepository {
  findById(id: string): Promise<SellerEntity | null>
  findByUserId(userId: string): Promise<SellerEntity | null>
  create(input: SellerCreateInput): Promise<SellerEntity>
  update(id: string, input: SellerUpdateInput): Promise<SellerEntity>
  /**
   * Transition kycStatus and atomically write a seller_kyc_* outbox event
   * recording the admin actor. Returns the refreshed seller.
   * Throws {@link SellerKycNotPendingException} if the current status
   * does not match `fromStatus` (concurrent moderation).
   */
  transitionKycStatus(input: SellerKycTransitionInput): Promise<SellerEntity>
}
