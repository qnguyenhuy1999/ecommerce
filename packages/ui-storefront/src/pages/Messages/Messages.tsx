'use client'

import { Button, Typography } from '@ecom/core-ui'
import { StorefrontLayout } from '../../layouts'
import type {
  MessagesConversationRecord,
  MessagesMessageRecord,
  MessagesProps,
} from './Messages.types'
import { getMessagesViewModel } from './Messages.controller'

function StartConversationForm({
  newShopId,
  newProductId,
  onNewShopIdChange,
  onNewProductIdChange,
  onStartConversation,
}: {
  newShopId: string
  newProductId: string
  onNewShopIdChange?: (v: string) => void
  onNewProductIdChange?: (v: string) => void
  onStartConversation?: () => void
}) {
  return (
    <div className="rounded-xl border p-4">
      <Typography variant="label" className="mb-3 block">
        Start conversation
      </Typography>
      <div className="flex flex-wrap gap-2">
        <input
          value={newShopId}
          onChange={(e) => onNewShopIdChange?.(e.target.value)}
          placeholder="Shop ID"
          className="border-input rounded-lg border px-3 py-2 text-sm"
        />
        <input
          value={newProductId}
          onChange={(e) => onNewProductIdChange?.(e.target.value)}
          placeholder="Product ID (optional)"
          className="border-input rounded-lg border px-3 py-2 text-sm"
        />
        <Button type="button" size="sm" onClick={onStartConversation}>
          Start
        </Button>
      </div>
    </div>
  )
}

function ConversationItem({
  conversation,
  isSelected,
  onSelect,
}: {
  conversation: MessagesConversationRecord
  isSelected: boolean
  onSelect: (id: string) => void
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(conversation.id)}
      className={`rounded-lg border p-3 text-left transition-colors ${
        isSelected ? 'bg-primary/10 border-primary/30' : 'hover:bg-accent'
      }`}
    >
      <Typography variant="label" as="div">
        Shop {conversation.shopIdShort}
      </Typography>
      <Typography variant="body-sm" className="text-muted-foreground truncate">
        {conversation.lastMessageText ?? 'No messages yet'}
      </Typography>
      {conversation.unreadCount > 0 && (
        <span className="bg-primary text-primary-foreground mt-1 inline-block rounded-full px-2 py-0.5 text-xs">
          {conversation.unreadCount}
        </span>
      )}
    </button>
  )
}

function MessageBubble({ message }: { message: MessagesMessageRecord }) {
  return (
    <div className="rounded-xl border p-3">
      <Typography variant="body-sm">{message.content}</Typography>
      <Typography variant="caption" className="text-muted-foreground mt-1">
        {message.createdAtLabel}
      </Typography>
    </div>
  )
}

export function Messages({
  conversations = [],
  messages = [],
  selectedConversationId,
  draft = '',
  newShopId = '',
  newProductId = '',
  loading = false,
  onSelectConversation,
  onDraftChange,
  onSend,
  onNewShopIdChange,
  onNewProductIdChange,
  onStartConversation,
}: MessagesProps) {
  const viewModel = getMessagesViewModel({
    conversations,
    messages,
    selectedConversationId,
    draft,
  })

  if (loading) {
    return (
      <StorefrontLayout>
        <StorefrontLayout.Content>
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-muted h-16 animate-pulse rounded-xl" />
            ))}
          </div>
        </StorefrontLayout.Content>
      </StorefrontLayout>
    )
  }

  return (
    <StorefrontLayout>
      <StorefrontLayout.Content>
        <div className="space-y-4">
          <StartConversationForm
            newShopId={newShopId}
            newProductId={newProductId}
            {...(onNewShopIdChange !== undefined ? { onNewShopIdChange } : {})}
            {...(onNewProductIdChange !== undefined ? { onNewProductIdChange } : {})}
            {...(onStartConversation !== undefined ? { onStartConversation } : {})}
          />

          <div className="grid gap-4 lg:grid-cols-[280px_1fr]">
            <aside className="rounded-xl border p-4">
              <Typography variant="label" className="mb-3 block">
                Conversations
              </Typography>
              <div className="space-y-2">
                {viewModel.hasConversations ? (
                  conversations.map((conversation) => (
                    <ConversationItem
                      key={conversation.id}
                      conversation={conversation}
                      isSelected={conversation.id === selectedConversationId}
                      onSelect={onSelectConversation ?? ((_id: string) => {})}
                    />
                  ))
                ) : (
                  <Typography variant="body-sm" className="text-muted-foreground">
                    Start a conversation to contact a shop.
                  </Typography>
                )}
              </div>
            </aside>

            <section className="rounded-xl border p-4">
              <Typography variant="label" className="mb-4 block">
                {viewModel.conversationTitle}
              </Typography>
              <div className="mb-4 min-h-80 space-y-2">
                {viewModel.hasMessages ? (
                  messages.map((message) => <MessageBubble key={message.id} message={message} />)
                ) : (
                  <div className="flex min-h-80 items-center justify-center rounded-lg border border-dashed p-6 text-center">
                    <Typography variant="body-sm" className="text-muted-foreground">
                      {selectedConversationId
                        ? 'Send the first message in this conversation.'
                        : 'Select a conversation to view messages.'}
                    </Typography>
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <input
                  value={draft}
                  onChange={(e) => onDraftChange?.(e.target.value)}
                  placeholder="Write a message…"
                  className="border-input flex-1 rounded-lg border px-3 py-2 text-sm"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      onSend?.()
                    }
                  }}
                />
                <Button type="button" size="sm" disabled={!viewModel.canSend} onClick={onSend}>
                  Send
                </Button>
              </div>
            </section>
          </div>
        </div>
      </StorefrontLayout.Content>
    </StorefrontLayout>
  )
}
