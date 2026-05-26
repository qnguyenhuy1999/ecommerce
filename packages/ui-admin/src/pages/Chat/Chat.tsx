import { chatDefaultProps } from './Chat.fixtures'
import { ChatClient } from './Chat.client'
import type { ChatProps } from './Chat.types'

export function Chat({
  title = chatDefaultProps.title,
  description = chatDefaultProps.description,
  conversations = chatDefaultProps.conversations,
  messages = chatDefaultProps.messages,
  selectedConversationId = chatDefaultProps.selectedConversationId,
  onSelectConversation = chatDefaultProps.onSelectConversation,
}: ChatProps) {
  const selectedConversation = conversations?.find((c) => c.id === selectedConversationId)

  return (
    <ChatClient
      title={title ?? 'Chat Monitor'}
      description={description ?? 'Read-only live view of buyer and seller conversations.'}
      conversations={conversations ?? []}
      messages={messages ?? []}
      {...(selectedConversationId !== undefined ? { selectedConversationId } : {})}
      {...(selectedConversation !== undefined
        ? { selectedConversationShortId: selectedConversation.id.slice(0, 8) }
        : {})}
      onSelectConversation={onSelectConversation}
    />
  )
}
