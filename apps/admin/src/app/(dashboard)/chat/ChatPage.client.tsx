'use client'

import { Chat } from '@ecom/ui-admin'
import { useChatAdapter } from '@/features/chat/hooks/use-chat-adapter'

export function ChatPageClient() {
  const props = useChatAdapter()
  return <Chat {...props} />
}
