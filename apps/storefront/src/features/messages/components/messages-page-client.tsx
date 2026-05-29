'use client'

import { Messages } from '@ecom/ui-storefront'
import { useMessagesAdapter } from '../hooks/use-messages-adapter'

export function MessagesPageClient() {
  const {
    loading,
    conversations,
    messages,
    selectedConversationId,
    onSelectConversation,
    draft,
    onDraftChange,
    onSend,
    onStartConversation,
    newShopId,
    onNewShopIdChange,
    newProductId,
    onNewProductIdChange,
  } = useMessagesAdapter()

  return (
    <Messages
      loading={loading}
      conversations={conversations}
      messages={messages}
      selectedConversationId={selectedConversationId}
      onSelectConversation={onSelectConversation}
      draft={draft}
      onDraftChange={onDraftChange}
      onSend={() => {
        void onSend()
      }}
      onStartConversation={() => {
        void onStartConversation()
      }}
      newShopId={newShopId}
      onNewShopIdChange={onNewShopIdChange}
      newProductId={newProductId}
      onNewProductIdChange={onNewProductIdChange}
    />
  )
}
