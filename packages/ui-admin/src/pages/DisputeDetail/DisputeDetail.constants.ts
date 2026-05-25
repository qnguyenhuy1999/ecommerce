import type { RefundParticipantRole } from './DisputeDetail.types'

export const REFUND_CONVERSATION_CARD_CLASS_NAMES: Record<RefundParticipantRole, string> = {
  BUYER: 'border-sky-200 bg-sky-50',
  SELLER: 'border-amber-200 bg-amber-50',
  ADMIN: 'border-orange-200 bg-orange-50',
} as const

export const REFUND_RESOLUTION_CHECKED_CLASS_NAME = 'border-orange-400 bg-orange-50' as const

export const REFUND_RESOLUTION_UNCHECKED_CLASS_NAME = 'border-border bg-card' as const

export function getConversationCardClassName(role: RefundParticipantRole): string {
  return REFUND_CONVERSATION_CARD_CLASS_NAMES[role] ?? 'border-border bg-card'
}
