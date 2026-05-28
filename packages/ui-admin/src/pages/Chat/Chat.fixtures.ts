import type { ChatProps } from './Chat.types'

export const chatDefaultProps: ChatProps = {
  title: 'Chat Monitor',
  description: 'Live view of buyer and seller conversations, with manual conversation creation.',
  newBuyerId: '',
  newShopId: '',
  newProductId: '',
  selectedConversationId: 'conv-001',
  conversations: [
    {
      id: 'conv-001',
      shopIdShort: 'shop-001…',
      buyerIdShort: 'buyer-ab…',
      lastMessageText: 'Is this still available?',
    },
    {
      id: 'conv-002',
      shopIdShort: 'shop-002…',
      buyerIdShort: 'buyer-cd…',
      lastMessageText: 'Thank you for the quick delivery!',
    },
  ],
  messages: [
    {
      id: 'msg-001',
      content: 'Is this still available?',
      senderIdShort: 'buyer-ab…',
      createdAtLabel: 'May 24, 2026, 10:00 AM',
    },
    {
      id: 'msg-002',
      content: 'Yes, it is! Would you like to place an order?',
      senderIdShort: 'shop-001…',
      createdAtLabel: 'May 24, 2026, 10:02 AM',
    },
  ],
}
