import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import type { SessionData } from '@ecom/auth'
import {
  ApiAuth,
  ApiCreatedResponseData,
  ApiErrorResponses,
  ApiOkResponseData,
  ApiPaginatedResponse,
} from '@ecom/nestjs-core/openapi'
import { CurrentUser } from '../auth/decorators/current-user.decorator'
import { AuthGuard } from '../auth/guards/auth.guard'
import type { ChatBuyerService } from './chat-buyer.service'
import type {
  ConversationQueryDto,
  CreateConversationDto,
  MessageQueryDto,
} from './dto/chat-query.dto'

@ApiTags('Storefront/Chat')
@ApiAuth()
@ApiErrorResponses()
@Controller('chat')
@UseGuards(AuthGuard)
export class ChatController {
  constructor(private readonly chatBuyerService: ChatBuyerService) {}

  @Get('conversations')
  @ApiPaginatedResponse(Object)
  async listConversations(@CurrentUser() user: SessionData, @Query() query: ConversationQueryDto) {
    return this.chatBuyerService.listConversations(user.userId, query)
  }

  @Post('conversations')
  @ApiCreatedResponseData(Object)
  async createConversation(@CurrentUser() user: SessionData, @Body() body: CreateConversationDto) {
    return this.chatBuyerService.createConversation(user.userId, body.shopId, body.productId)
  }

  @Get('unread')
  @ApiOkResponseData(Object)
  async unreadCount(@CurrentUser() user: SessionData) {
    return this.chatBuyerService.getUnreadCount(user.userId)
  }

  @Get('conversations/:id')
  @ApiOkResponseData(Object)
  async getConversation(@CurrentUser() user: SessionData, @Param('id') id: string) {
    return this.chatBuyerService.getConversation(user.userId, id)
  }

  @Get('conversations/:id/messages')
  @ApiPaginatedResponse(Object)
  async getMessages(
    @CurrentUser() user: SessionData,
    @Param('id') id: string,
    @Query() query: MessageQueryDto,
  ) {
    return this.chatBuyerService.getMessages(user.userId, id, query)
  }

  @Post('conversations/:id/messages')
  @ApiCreatedResponseData(Object)
  async sendMessage(
    @CurrentUser() user: SessionData,
    @Param('id') id: string,
    @Body()
    body: {
      content: string
      type?: 'TEXT' | 'IMAGE' | 'PRODUCT'
      metadata?: Record<string, unknown>
    },
  ) {
    return this.chatBuyerService.sendMessage(
      user.userId,
      id,
      body.content,
      body.type,
      body.metadata,
    )
  }

  @Post('conversations/:id/read')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOkResponseData(Object)
  async markAsRead(@CurrentUser() user: SessionData, @Param('id') id: string) {
    await this.chatBuyerService.markAsRead(user.userId, id)
  }
}
