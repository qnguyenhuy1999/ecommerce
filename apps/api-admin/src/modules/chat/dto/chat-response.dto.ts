import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class ChatConversationSummaryDto {
  @ApiProperty({ example: 'conv_123' })
  id!: string

  @ApiProperty({ example: 'buyer_123' })
  buyerId!: string

  @ApiProperty({ example: 'shop_123' })
  shopId!: string

  @ApiPropertyOptional({ example: 'Need help with my order', nullable: true })
  lastMessageText!: string | null

  @ApiProperty({ example: '2026-05-27T10:00:00.000Z' })
  updatedAt!: string
}

export class ChatMessageDto {
  @ApiProperty({ example: 'msg_123' })
  id!: string

  @ApiProperty({ example: 'conv_123' })
  conversationId!: string

  @ApiProperty({ example: 'user_123' })
  senderId!: string

  @ApiProperty({ example: 'Can you check this order?' })
  content!: string

  @ApiProperty({ example: '2026-05-27T10:01:00.000Z' })
  createdAt!: string
}

export class ChatConversationDetailDto {
  @ApiProperty({ type: () => ChatConversationSummaryDto })
  conversation!: ChatConversationSummaryDto
}
