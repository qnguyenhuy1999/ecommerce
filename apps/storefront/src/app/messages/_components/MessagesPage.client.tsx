'use client'

import { Messages } from '@ecom/ui-storefront/pages/Messages'
import { useMessagesAdapter } from '../../../features/messages/hooks/use-messages-adapter'

export function MessagesPageClient() {
  const {
    loadingConversations,
    loadingMessages,
    conversations,
    messages,
    selectedConversationId,
    onSelectedConversationChange,
    draftMessage,
    onDraftMessageChange,
    onSendMessage,
  } = useMessagesAdapter()

  return (
    <Messages
      title="Messages"
      description="Conversations with shops"
      loadingConversations={loadingConversations}
      loadingMessages={loadingMessages}
      conversations={conversations}
      messages={messages}
      {...(selectedConversationId !== undefined ? { selectedConversationId } : {})}
      onSelectedConversationChange={onSelectedConversationChange}
      draftMessage={draftMessage}
      onDraftMessageChange={onDraftMessageChange}
      onSendMessage={() => onSendMessage()}
    />
  )
}
