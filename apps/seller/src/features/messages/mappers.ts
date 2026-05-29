export {
  appendMessage,
  applyIncomingMessageResult,
  getSelectedConversationId,
  getUnreadConversationCount,
  mapConversationsToUi,
  mapMessagesToUi,
  markConversationAsReadResult,
  sortConversationsByActivity,
  updateConversationsAfterSend,
} from '../integration/seller-page-adapters'
export type { SellerChatConversation, SellerChatMessage } from '../integration/seller-page-adapters'
