import { ApiProperty } from '@nestjs/swagger'

export class ChatConversationDto {
  @ApiProperty()
  id!: string

  @ApiProperty()
  buyerId!: string

  @ApiProperty()
  shopId!: string

  @ApiProperty({ nullable: true, type: String })
  productId!: string | null

  @ApiProperty({ nullable: true, type: String })
  lastMessageText!: string | null

  @ApiProperty({ nullable: true, type: Date })
  lastMessageAt!: Date | null

  @ApiProperty()
  buyerUnread!: number

  @ApiProperty()
  sellerUnread!: number

  @ApiProperty()
  createdAt!: Date

  @ApiProperty()
  updatedAt!: Date
}

export class ChatMessageDto {
  @ApiProperty()
  id!: string

  @ApiProperty()
  conversationId!: string

  @ApiProperty()
  senderId!: string

  @ApiProperty()
  type!: string

  @ApiProperty()
  content!: string

  @ApiProperty({ nullable: true, type: Object })
  metadata!: Record<string, unknown> | null

  @ApiProperty()
  isReadByBuyer!: boolean

  @ApiProperty()
  isReadBySeller!: boolean

  @ApiProperty()
  createdAt!: Date

  @ApiProperty()
  updatedAt!: Date
}

export class ChatUnreadCountDto {
  @ApiProperty()
  unreadCount!: number
}
