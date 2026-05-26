'use client'

import { Chat, type ChatProps } from '@ecom/ui-admin'
import { useChatAdapter } from '@/features/chat/hooks/use-chat-adapter'

export function ChatPageClient() {
  const props: ChatProps = useChatAdapter()
  return <Chat {...props} />
}
