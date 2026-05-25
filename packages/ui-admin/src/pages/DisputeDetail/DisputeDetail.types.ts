import type { RefundRecord } from '../Disputes/Disputes.types'

export type RefundParticipantRole = 'BUYER' | 'SELLER' | 'ADMIN'

export interface RefundConversationItem {
  id: string
  role: RefundParticipantRole
  message: string
  dateLabel: string
}

export interface RefundEvidenceItem {
  id: string
  label: string
  caption: string
  imageSrc: string
  imageAlt: string
}

export interface RefundResolutionOption {
  value: string
  title: string
  description: string
}

export interface RefundAuditEvent {
  id: string
  actor: string
  action: string
  dateLabel: string
}

export interface RefundDetailRecord extends RefundRecord {
  shopName: string
  placedAtLabel: string
  itemTitle: string
  itemImageSrc: string
  itemImageAlt: string
  itemQuantityLabel: string
  orderStatusLabel: string
  statusLabel: string
  internalNotePlaceholder: string
  resolutionActionLabel: string
  selectedResolution: string
  conversation: RefundConversationItem[]
  evidence: RefundEvidenceItem[]
  resolutionOptions: RefundResolutionOption[]
  auditTrail: RefundAuditEvent[]
}

export interface RefundDetailSubmitPayload {
  item: RefundDetailRecord
  resolution: string
  note: string
}

export interface RefundDetailProps {
  item?: RefundDetailRecord
  backHref?: string
  onApplyResolution?: ((payload: RefundDetailSubmitPayload) => void | Promise<void>) | undefined
}
