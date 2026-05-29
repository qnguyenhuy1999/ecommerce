'use client'

import { Messages } from '@ecom/ui-seller'
import { useMessagesAdapter } from '@/features/messages/hooks/use-messages-adapter'

export default function MessagesPage() {
  const {
    loadingConversations,
    loadingMessages,
    conversationsError,
    messagesError,
    conversations,
    messages,
    selectedConversationId,
    onSelectedConversationChange,
    search,
    onSearchChange,
    onSendMessage,
  } = useMessagesAdapter()

  const emptyConversationsMessage = conversationsError
    ? conversationsError
    : loadingConversations
      ? 'Loading conversations...'
      : 'No conversations found.'

  const emptyMessagesMessage = messagesError
    ? messagesError
    : loadingMessages
      ? 'Loading messages...'
      : 'No messages yet.'

  return (
    <Messages
      conversations={conversations}
      messages={messages}
      {...(selectedConversationId ? { selectedConversationId } : {})}
      onSelectedConversationChange={onSelectedConversationChange}
      search={search}
      onSearchChange={onSearchChange}
      loadingConversations={loadingConversations}
      loadingMessages={loadingMessages}
      onSendMessage={(conversation, content) => onSendMessage(conversation.id, content)}
      emptyConversationsMessage={emptyConversationsMessage}
      emptyMessagesMessage={emptyMessagesMessage}
    />
  )
}
