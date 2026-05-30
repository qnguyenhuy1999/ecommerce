'use client'

import { Chat } from '@ecom/ui-admin/pages/Chat'
import { useChatAdapter } from '@/features/chat/hooks/use-chat-adapter'

export function ChatPageClient() {
  const props = useChatAdapter()
  return <Chat {...props} />
}
