'use client'

import { Messages } from '@ecom/ui-admin/pages/Messages'
import { useChatAdapter } from '@/features/chat/hooks/use-chat-adapter'

export function ChatPageClient() {
  const props = useChatAdapter()
  return (
    <Messages
      {...props}
      title="Chat Monitor"
      description="Live view of buyer and seller conversations."
    />
  )
}
