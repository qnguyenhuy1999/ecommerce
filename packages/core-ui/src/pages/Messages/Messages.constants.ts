import type { MessageDeliveryStatus } from './Messages.types'

export const DELIVERY_STATUS_LABELS: Record<MessageDeliveryStatus, string> = {
  SENDING: 'Sending',
  SENT: 'Sent',
  DELIVERED: 'Delivered',
  READ: 'Read',
  FAILED: 'Failed',
}

export const MESSAGES_EMPTY = {
  noConversationsTitle: 'No conversations yet',
  noConversationsGuidance: 'New buyer threads will appear here as soon as they start a chat.',
  noMatchingTitle: 'No matching conversations',
  noMatchingGuidance: 'Try a buyer name, order number, or a shorter keyword.',
  noMessagesTitle: 'No messages yet',
  noMessagesGuidance: 'Send the first reply to start the conversation.',
  unselectedTitle: 'No conversation selected',
  unselectedGuidance: 'Pick a thread from the list to view messages and reply.',
} as const
