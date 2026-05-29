import {
  getConversationMessages as getConversationMessagesBase,
  getMessageConversations as getMessageConversationsBase,
  markConversationRead,
  sendConversationMessage,
} from '../integration/seller-page-api'

export async function getMessageConversations(search?: string) {
  const conversations = await getMessageConversationsBase(search)
  return { items: conversations.items }
}

export async function getConversationMessages(conversationId: string) {
  const messages = await getConversationMessagesBase(conversationId)
  return { items: messages.items }
}

export { markConversationRead, sendConversationMessage }
