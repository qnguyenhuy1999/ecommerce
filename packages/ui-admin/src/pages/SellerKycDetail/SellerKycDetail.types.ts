export type SellerKycDetailStatus = 'APPROVED' | 'PENDING' | 'REJECTED'

export type SellerKycDetailSection = 'KYC_REVIEW' | 'VIOLATIONS' | 'PROFILE'

export interface SellerKycDetailTab {
  value: SellerKycDetailSection
  label: string
}

export interface SellerKycDetailField {
  label: string
  value: string
}

export interface SellerKycDetailDocument {
  id: string
  title: string
  uploadedAtLabel: string
  typeLabel: string
  previewSrc: string
  previewAlt: string
  status: SellerKycDetailStatus
}

export interface SellerKycDetailAuditEvent {
  id: string
  actor: string
  action: string
  target?: string
  dateLabel: string
}

export interface SellerKycDetailRecord {
  id: string
  sellerName: string
  ownerName: string
  ownerEmail: string
  appliedAtLabel: string
  status: SellerKycDetailStatus
  tabs: SellerKycDetailTab[]
  applicant: SellerKycDetailField[]
  bankName: string
  bankAccountLabel: string
  riskScore: number
  riskSummary: string
  documentsApprovedLabel: string
  documents: SellerKycDetailDocument[]
  approvalHint: string
  auditTrail: SellerKycDetailAuditEvent[]
}

export interface SellerKycDetailDocumentActionPayload {
  item: SellerKycDetailRecord
  document: SellerKycDetailDocument
}

export interface SellerKycDetailProps {
  item?: SellerKycDetailRecord
  backHref?: string
  approveDocumentLabel?: string
  rejectDocumentLabel?: string
  requestNewLabel?: string
  rejectSellerLabel?: string
  approveSellerLabel?: string
  onApproveDocument?:
    | ((payload: SellerKycDetailDocumentActionPayload) => void | Promise<void>)
    | undefined
  onRejectDocument?:
    | ((payload: SellerKycDetailDocumentActionPayload) => void | Promise<void>)
    | undefined
  onRequestNewDocument?:
    | ((payload: SellerKycDetailDocumentActionPayload) => void | Promise<void>)
    | undefined
  onRejectSeller?: ((item: SellerKycDetailRecord) => void | Promise<void>) | undefined
  onApproveSeller?: ((item: SellerKycDetailRecord) => void | Promise<void>) | undefined
}
