import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import {
  ApiAuth,
  ApiCreatedResponseData,
  ApiErrorResponses,
  ApiOkResponseData,
  ApiPaginatedResponse,
} from '@ecom/nestjs-core/openapi'
import { Permissions } from '../auth/decorators/permissions.decorator'
import { AdminAuthGuard } from '../auth/guards/admin-auth.guard'
import { PermissionGuard } from '../auth/guards/permission.guard'
import { Inject } from '@nestjs/common'
import { ChatAdminService } from './chat-admin.service'
import {
  ChatConversationDetailDto,
  ChatConversationSummaryDto,
  ChatMessageDto,
} from './dto/chat-response.dto'
import { ConversationQueryDto, CreateConversationDto, MessageQueryDto } from './dto/chat-query.dto'

@ApiTags('Admin/Chat')
@ApiAuth()
@ApiErrorResponses()
@Controller('chat')
@UseGuards(AdminAuthGuard, PermissionGuard)
export class ChatController {
  constructor(@Inject(ChatAdminService) private readonly chatAdminService: ChatAdminService) {}

  @Get('conversations')
  @Permissions('SETTINGS_MANAGE')
  @ApiPaginatedResponse(ChatConversationSummaryDto)
  async listConversations(@Query() query: ConversationQueryDto) {
    return this.chatAdminService.listConversations(query)
  }

  @Post('conversations')
  @Permissions('SETTINGS_MANAGE')
  @ApiCreatedResponseData(ChatConversationSummaryDto)
  async createConversation(@Body() body: CreateConversationDto) {
    return this.chatAdminService.createConversation(body.buyerId, body.shopId, body.productId)
  }

  @Get('conversations/:id')
  @Permissions('SETTINGS_MANAGE')
  @ApiOkResponseData(ChatConversationDetailDto)
  async getConversation(@Param('id') id: string) {
    return this.chatAdminService.getConversation(id)
  }

  @Get('conversations/:id/messages')
  @Permissions('SETTINGS_MANAGE')
  @ApiPaginatedResponse(ChatMessageDto)
  async getMessages(@Param('id') id: string, @Query() query: MessageQueryDto) {
    return this.chatAdminService.getMessages(id, query)
  }
}
