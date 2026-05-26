import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import {
  ApiAuth,
  ApiErrorResponses,
  ApiOkResponseData,
  ApiPaginatedResponse,
} from '@ecom/nestjs-core/openapi'
import { Permissions } from '../auth/decorators/permissions.decorator'
import { AdminAuthGuard } from '../auth/guards/admin-auth.guard'
import { PermissionGuard } from '../auth/guards/permission.guard'
import type { ChatAdminService } from './chat-admin.service'
import type { ConversationQueryDto, MessageQueryDto } from './dto/chat-query.dto'

@ApiTags('Admin/Chat')
@ApiAuth()
@ApiErrorResponses()
@Controller('chat')
@UseGuards(AdminAuthGuard, PermissionGuard)
export class ChatController {
  constructor(private readonly chatAdminService: ChatAdminService) {}

  @Get('conversations')
  @Permissions('SETTINGS_MANAGE')
  @ApiPaginatedResponse(Object)
  async listConversations(@Query() query: ConversationQueryDto) {
    return this.chatAdminService.listConversations(query)
  }

  @Get('conversations/:id')
  @Permissions('SETTINGS_MANAGE')
  @ApiOkResponseData(Object)
  async getConversation(@Param('id') id: string) {
    return this.chatAdminService.getConversation(id)
  }

  @Get('conversations/:id/messages')
  @Permissions('SETTINGS_MANAGE')
  @ApiPaginatedResponse(Object)
  async getMessages(@Param('id') id: string, @Query() query: MessageQueryDto) {
    return this.chatAdminService.getMessages(id, query)
  }
}
