export type KycStatus = 'PENDING' | 'APPROVED' | 'REJECTED'

export interface SellerProps {
  id: string
  userId: string
  storeName: string
  storeDescription: string | null
  kycStatus: KycStatus
  kycDocuments: Record<string, unknown> | null
  commissionRate: number
  rating: number
  totalRatings: number
  businessRegistrationNumber: string | null
  bankAccountNumber: string | null
  bankCode: string | null
  createdAt: Date
  updatedAt: Date
}

export class SellerEntity {
  constructor(readonly props: SellerProps) {}

  get id(): string {
    return this.props.id
  }

  get userId(): string {
    return this.props.userId
  }

  get kycStatus(): KycStatus {
    return this.props.kycStatus
  }

  isOwnedBy(userId: string): boolean {
    return this.props.userId === userId
  }

  isPending(): boolean {
    return this.props.kycStatus === 'PENDING'
  }

  isApproved(): boolean {
    return this.props.kycStatus === 'APPROVED'
  }

  isRejected(): boolean {
    return this.props.kycStatus === 'REJECTED'
  }
}
