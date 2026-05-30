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
import { ApiNoContentResponse, ApiTags } from '@nestjs/swagger'
import type { SessionData } from '@ecom/auth/session.service'
import { ApiAuth } from '@ecom/nestjs-core/openapi/decorators/api-auth.decorator'
import {
  ApiCreatedResponseData,
  ApiOkResponseData,
  ApiPaginatedResponse,
} from '@ecom/nestjs-core/openapi/decorators/api-response.decorator'
import { ApiErrorResponses } from '@ecom/nestjs-core/openapi/decorators/api-error-responses.decorator'
import { CurrentUser } from '../auth/decorators/current-user.decorator'
import { AuthGuard } from '../auth/guards/auth.guard'
import { ChatBuyerService } from './chat-buyer.service'
import { ChatConversationDto, ChatMessageDto, ChatUnreadCountDto } from './dto/chat.dto'
import type {
  ConversationQueryDto,
  CreateConversationDto,
  MessageQueryDto,
  SendMessageDto,
} from './dto/chat-query.dto'

@ApiTags('Storefront/Chat')
@ApiAuth()
@ApiErrorResponses()
@Controller('chat')
@UseGuards(AuthGuard)
export class ChatController {
  constructor(private readonly chatBuyerService: ChatBuyerService) {}

  @Get('conversations')
  @ApiPaginatedResponse(ChatConversationDto)
  async listConversations(@CurrentUser() user: SessionData, @Query() query: ConversationQueryDto) {
    return this.chatBuyerService.listConversations(user.userId, query)
  }

  @Post('conversations')
  @ApiCreatedResponseData(ChatConversationDto)
  async createConversation(@CurrentUser() user: SessionData, @Body() body: CreateConversationDto) {
    return this.chatBuyerService.createConversation(user.userId, body.shopId, body.productId)
  }

  @Get('unread')
  @ApiOkResponseData(ChatUnreadCountDto)
  async unreadCount(@CurrentUser() user: SessionData) {
    return this.chatBuyerService.getUnreadCount(user.userId)
  }

  @Get('conversations/:id')
  @ApiOkResponseData(ChatConversationDto)
  async getConversation(@CurrentUser() user: SessionData, @Param('id') id: string) {
    return this.chatBuyerService.getConversation(user.userId, id)
  }

  @Get('conversations/:id/messages')
  @ApiPaginatedResponse(ChatMessageDto)
  async getMessages(
    @CurrentUser() user: SessionData,
    @Param('id') id: string,
    @Query() query: MessageQueryDto,
  ) {
    return this.chatBuyerService.getMessages(user.userId, id, query)
  }

  @Post('conversations/:id/messages')
  @ApiCreatedResponseData(ChatMessageDto)
  async sendMessage(
    @CurrentUser() user: SessionData,
    @Param('id') id: string,
    @Body() body: SendMessageDto,
  ) {
    return this.chatBuyerService.sendMessage(user.userId, id, body.content, body.type)
  }

  @Post('conversations/:id/read')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse()
  async markAsRead(@CurrentUser() user: SessionData, @Param('id') id: string) {
    await this.chatBuyerService.markAsRead(user.userId, id)
  }
}
