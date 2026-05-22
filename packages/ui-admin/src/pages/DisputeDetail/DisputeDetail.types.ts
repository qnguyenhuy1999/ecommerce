import type { DisputeRecord } from '../Disputes/Disputes.types'

export type DisputeParticipantRole = 'BUYER' | 'SELLER' | 'ADMIN'

export interface DisputeConversationItem {
  id: string
  role: DisputeParticipantRole
  message: string
  dateLabel: string
}

export interface DisputeEvidenceItem {
  id: string
  label: string
  caption: string
  imageSrc: string
  imageAlt: string
}

export interface DisputeResolutionOption {
  value: string
  title: string
  description: string
}

export interface DisputeAuditEvent {
  id: string
  actor: string
  action: string
  dateLabel: string
}

export interface DisputeDetailRecord extends DisputeRecord {
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
  conversation: DisputeConversationItem[]
  evidence: DisputeEvidenceItem[]
  resolutionOptions: DisputeResolutionOption[]
  auditTrail: DisputeAuditEvent[]
}

export interface DisputeDetailSubmitPayload {
  item: DisputeDetailRecord
  resolution: string
  note: string
}

export interface DisputeDetailProps {
  item?: DisputeDetailRecord
  backHref?: string
  onApplyResolution?: ((payload: DisputeDetailSubmitPayload) => void | Promise<void>) | undefined
}
