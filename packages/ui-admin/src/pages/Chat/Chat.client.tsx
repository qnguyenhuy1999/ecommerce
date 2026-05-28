'use client'

import { Button } from '@ecom/core-ui'
import { Typography } from '@ecom/core-ui'
import type { ChatConversationRecord, ChatMessageRecord, ChatProps } from './Chat.types'

interface ConversationItemProps {
  conversation: ChatConversationRecord
  isSelected: boolean
  onSelect: (id: string) => void
}

function ConversationItem({ conversation, isSelected, onSelect }: ConversationItemProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(conversation.id)}
      className={`rounded-lg border p-3 text-left transition-colors ${
        isSelected ? 'bg-accent' : 'bg-background hover:bg-accent/50'
      }`}
    >
      <Typography variant="label" as="div">
        Shop {conversation.shopIdShort}
      </Typography>
      <Typography variant="body-sm" className="text-muted-foreground">
        Buyer {conversation.buyerIdShort}
      </Typography>
      <Typography variant="body-sm" className="mt-1">
        {conversation.lastMessageText ?? 'No messages yet'}
      </Typography>
    </button>
  )
}

function MessageItem({ message }: { message: ChatMessageRecord }) {
  return (
    <div className="rounded-lg border p-3">
      <Typography variant="body-sm">{message.content}</Typography>
      <Typography variant="caption" className="text-muted-foreground mt-1">
        Sender {message.senderIdShort} · {message.createdAtLabel}
      </Typography>
    </div>
  )
}

function StartConversationForm({
  newBuyerId,
  newShopId,
  newProductId,
  onNewBuyerIdChange,
  onNewShopIdChange,
  onNewProductIdChange,
  onStartConversation,
}: {
  newBuyerId: string
  newShopId: string
  newProductId: string
  onNewBuyerIdChange?: (value: string) => void
  onNewShopIdChange?: (value: string) => void
  onNewProductIdChange?: (value: string) => void
  onStartConversation?: () => void
}) {
  return (
    <div className="bg-card rounded-xl border p-4">
      <Typography variant="label" className="mb-3 block">
        Create conversation
      </Typography>
      <div className="flex flex-wrap gap-2">
        <input
          value={newBuyerId}
          onChange={(event) => onNewBuyerIdChange?.(event.target.value)}
          placeholder="Buyer ID"
          className="border-input rounded-lg border px-3 py-2 text-sm"
        />
        <input
          value={newShopId}
          onChange={(event) => onNewShopIdChange?.(event.target.value)}
          placeholder="Shop ID"
          className="border-input rounded-lg border px-3 py-2 text-sm"
        />
        <input
          value={newProductId}
          onChange={(event) => onNewProductIdChange?.(event.target.value)}
          placeholder="Product ID (optional)"
          className="border-input rounded-lg border px-3 py-2 text-sm"
        />
        <Button type="button" size="sm" onClick={onStartConversation}>
          Create
        </Button>
      </div>
    </div>
  )
}

interface ChatClientProps {
  title: string
  description: string
  conversations: ChatConversationRecord[]
  messages: ChatMessageRecord[]
  selectedConversationId?: string
  selectedConversationShortId?: string
  onSelectConversation?: ChatProps['onSelectConversation']
  newBuyerId: string
  newShopId: string
  newProductId: string
  onNewBuyerIdChange?: ChatProps['onNewBuyerIdChange']
  onNewShopIdChange?: ChatProps['onNewShopIdChange']
  onNewProductIdChange?: ChatProps['onNewProductIdChange']
  onStartConversation?: ChatProps['onStartConversation']
}

export function ChatClient({
  title,
  description,
  conversations,
  messages,
  selectedConversationId,
  selectedConversationShortId,
  onSelectConversation,
  newBuyerId,
  newShopId,
  newProductId,
  onNewBuyerIdChange,
  onNewShopIdChange,
  onNewProductIdChange,
  onStartConversation,
}: ChatClientProps) {
  return (
    <div className="grid gap-4">
      <div>
        <Typography variant="h1">{title}</Typography>
        <Typography variant="body-sm" className="text-muted-foreground">
          {description}
        </Typography>
      </div>

      <StartConversationForm
        newBuyerId={newBuyerId}
        newShopId={newShopId}
        newProductId={newProductId}
        {...(onNewBuyerIdChange !== undefined ? { onNewBuyerIdChange } : {})}
        {...(onNewShopIdChange !== undefined ? { onNewShopIdChange } : {})}
        {...(onNewProductIdChange !== undefined ? { onNewProductIdChange } : {})}
        {...(onStartConversation !== undefined ? { onStartConversation } : {})}
      />

      <div className="grid gap-4 lg:grid-cols-[320px_1fr]">
        <aside className="bg-card rounded-xl border p-4">
          <Typography variant="label" className="mb-3 block">
            Conversations
          </Typography>
          <div className="grid gap-2">
            {conversations.map((conversation) => (
              <ConversationItem
                key={conversation.id}
                conversation={conversation}
                isSelected={conversation.id === selectedConversationId}
                onSelect={onSelectConversation ?? (() => {})}
              />
            ))}
          </div>
        </aside>

        <section className="bg-card rounded-xl border p-4">
          <div className="mb-4">
            <Typography variant="label" as="div">
              {selectedConversationShortId
                ? `Conversation ${selectedConversationShortId}`
                : 'Conversation'}
            </Typography>
            <Typography variant="body-sm" className="text-muted-foreground">
              Live admin view of buyer and seller chat activity.
            </Typography>
          </div>

          <div className="grid gap-2">
            {messages.map((message) => (
              <MessageItem key={message.id} message={message} />
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
