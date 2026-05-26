export interface MessagesConversationRecord {
  id: string
  shopIdShort: string
  lastMessageText: string | null
  unreadCount: number
}

export interface MessagesMessageRecord {
  id: string
  content: string
  createdAtLabel: string
}

export interface MessagesProps {
  conversations?: MessagesConversationRecord[]
  messages?: MessagesMessageRecord[]
  selectedConversationId?: string | undefined
  draft?: string
  newShopId?: string
  newProductId?: string
  loading?: boolean
  onSelectConversation?: (id: string) => void
  onDraftChange?: (value: string) => void
  onSend?: () => void
  onNewShopIdChange?: (value: string) => void
  onNewProductIdChange?: (value: string) => void
  onStartConversation?: () => void
}
