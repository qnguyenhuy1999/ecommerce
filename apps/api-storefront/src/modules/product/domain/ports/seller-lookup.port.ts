import type { SellerSummary } from '../entities/seller.entity'

export const SELLER_LOOKUP = Symbol('SELLER_LOOKUP')

export interface ISellerLookup {
  findByUserId(userId: string): Promise<SellerSummary | null>
}
