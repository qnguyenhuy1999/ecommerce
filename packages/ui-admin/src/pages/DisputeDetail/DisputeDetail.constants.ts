import type { DisputeParticipantRole } from './DisputeDetail.types'

export const DISPUTE_CONVERSATION_CARD_CLASS_NAMES: Record<DisputeParticipantRole, string> = {
  BUYER: 'border-sky-200 bg-sky-50',
  SELLER: 'border-amber-200 bg-amber-50',
  ADMIN: 'border-orange-200 bg-orange-50',
} as const

export const DISPUTE_RESOLUTION_CHECKED_CLASS_NAME = 'border-orange-400 bg-orange-50' as const

export const DISPUTE_RESOLUTION_UNCHECKED_CLASS_NAME = 'border-border bg-card' as const

export function getConversationCardClassName(role: DisputeParticipantRole): string {
  return DISPUTE_CONVERSATION_CARD_CLASS_NAMES[role] ?? 'border-border bg-card'
}
