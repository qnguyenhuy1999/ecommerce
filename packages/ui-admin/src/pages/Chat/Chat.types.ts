export interface ChatConversationRecord {
  id: string
  shopIdShort: string
  buyerIdShort: string
  lastMessageText: string | null
}

export interface ChatMessageRecord {
  id: string
  content: string
  senderIdShort: string
  createdAtLabel: string
}

export interface ChatProps {
  title?: string
  description?: string
  conversations?: ChatConversationRecord[]
  messages?: ChatMessageRecord[]
  selectedConversationId?: string
  newBuyerId?: string
  newShopId?: string
  newProductId?: string
  onSelectConversation?: (id: string) => void
  onNewBuyerIdChange?: (value: string) => void
  onNewShopIdChange?: (value: string) => void
  onNewProductIdChange?: (value: string) => void
  onStartConversation?: () => void
}
