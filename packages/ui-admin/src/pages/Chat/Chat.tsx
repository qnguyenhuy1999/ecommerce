import { chatDefaultProps } from './Chat.fixtures'
import { ChatClient } from './Chat.client'
import type { ChatProps } from './Chat.types'

export function Chat({
  title = chatDefaultProps.title,
  description = chatDefaultProps.description,
  conversations = chatDefaultProps.conversations,
  messages = chatDefaultProps.messages,
  selectedConversationId = chatDefaultProps.selectedConversationId,
  newBuyerId = chatDefaultProps.newBuyerId,
  newShopId = chatDefaultProps.newShopId,
  newProductId = chatDefaultProps.newProductId,
  onSelectConversation = chatDefaultProps.onSelectConversation,
  onNewBuyerIdChange = chatDefaultProps.onNewBuyerIdChange,
  onNewShopIdChange = chatDefaultProps.onNewShopIdChange,
  onNewProductIdChange = chatDefaultProps.onNewProductIdChange,
  onStartConversation = chatDefaultProps.onStartConversation,
}: ChatProps) {
  const selectedConversation = conversations?.find((c) => c.id === selectedConversationId)

  return (
    <ChatClient
      title={title ?? 'Chat Monitor'}
      description={
        description ?? 'Live view of buyer and seller conversations, with manual creation.'
      }
      conversations={conversations ?? []}
      messages={messages ?? []}
      {...(selectedConversationId !== undefined ? { selectedConversationId } : {})}
      newBuyerId={newBuyerId ?? ''}
      newShopId={newShopId ?? ''}
      newProductId={newProductId ?? ''}
      {...(selectedConversation !== undefined
        ? { selectedConversationShortId: selectedConversation.id.slice(0, 8) }
        : {})}
      {...(onSelectConversation !== undefined ? { onSelectConversation } : {})}
      {...(onNewBuyerIdChange !== undefined ? { onNewBuyerIdChange } : {})}
      {...(onNewShopIdChange !== undefined ? { onNewShopIdChange } : {})}
      {...(onNewProductIdChange !== undefined ? { onNewProductIdChange } : {})}
      {...(onStartConversation !== undefined ? { onStartConversation } : {})}
    />
  )
}
