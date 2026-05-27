import type { StorefrontComponents } from '@ecom/contracts/generated'

export type ChatConversation = StorefrontComponents['schemas']['ChatConversationDto']
export type ChatMessage = StorefrontComponents['schemas']['ChatMessageDto']
export type NotificationItem = StorefrontComponents['schemas']['NotificationResponseDto']
export type HomepageData = StorefrontComponents['schemas']['HomepageDto']
export type PaginationMeta = StorefrontComponents['schemas']['PaginationMetaDto']

type ApiEnvelope<T> = {
  success: true
  data: T
  timestamp: string
  message?: string
  meta?: Record<string, unknown>
}

type ApiPaginatedEnvelope<T> = {
  success: true
  data: { items: T[] }
  meta: PaginationMeta
  timestamp: string
  message?: string
}

export type ChatConversationsResponse = ApiPaginatedEnvelope<ChatConversation>

export type ChatMessagesResponse = ApiPaginatedEnvelope<ChatMessage>

export type ChatConversationResponse = ApiEnvelope<ChatConversation>

export type ChatUnreadCountResponse = ApiEnvelope<
  StorefrontComponents['schemas']['ChatUnreadCountDto']
>

export type NotificationsResponse = ApiPaginatedEnvelope<NotificationItem>

export type NotificationUnreadCountResponse = ApiEnvelope<
  StorefrontComponents['schemas']['NotificationUnreadCountDto']
>

export type HomepageResponse = ApiEnvelope<HomepageData>
