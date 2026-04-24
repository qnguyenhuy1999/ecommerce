export type KycStatus = 'PENDING' | 'APPROVED' | 'REJECTED'

export interface SellerSummaryProps {
  id: string
  userId: string
  storeName: string
  kycStatus: KycStatus
}

export class SellerSummary {
  constructor(readonly props: SellerSummaryProps) {}

  get id(): string {
    return this.props.id
  }

  get userId(): string {
    return this.props.userId
  }

  get kycStatus(): KycStatus {
    return this.props.kycStatus
  }

  isKycApproved(): boolean {
    return this.props.kycStatus === 'APPROVED'
  }
}
