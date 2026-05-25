import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common'
import { ApiExtraModels, ApiOperation, ApiTags } from '@nestjs/swagger'
import {
  ApiAuth,
  ApiErrorResponses,
  ApiOkResponseData,
  ApiPaginatedResponse,
} from '@ecom/nestjs-core/openapi'
import { CurrentAdmin, type AdminSessionData } from '../auth/decorators/current-admin.decorator'
import { Permissions } from '../auth/decorators/permissions.decorator'
import { AdminAuthGuard } from '../auth/guards/admin-auth.guard'
import { PermissionGuard } from '../auth/guards/permission.guard'
import { AuditLog } from '../common/decorators/audit-log.decorator'
import type {
  ChangeAssigneeDto,
  ChangeStatusDto,
  SendReplyDto,
  SupportTicketQueryDto,
} from './dto/support.dto'
import { SupportMessageResponseDto, SupportTicketResponseDto } from './dto/support.dto'
import { SupportService } from './support.service'

@ApiTags('Admin/Support')
@Controller('support')
@UseGuards(AdminAuthGuard, PermissionGuard)
@ApiAuth()
@ApiErrorResponses()
@ApiExtraModels(SupportTicketResponseDto, SupportMessageResponseDto)
export class SupportController {
  constructor(private readonly supportService: SupportService) {}

  @Get('tickets')
  @Permissions('SETTINGS_MANAGE')
  @ApiOperation({ summary: 'List support tickets' })
  @ApiPaginatedResponse(SupportTicketResponseDto)
  async findAll(@Query() query: SupportTicketQueryDto) {
    return this.supportService.findAll(query)
  }

  @Get('tickets/:id/messages')
  @Permissions('SETTINGS_MANAGE')
  @ApiOperation({ summary: 'Get messages for a ticket' })
  @ApiOkResponseData([SupportMessageResponseDto])
  async findMessages(@Param('id') id: string) {
    return this.supportService.findMessages(id)
  }

  @Post('tickets/:id/reply')
  @Permissions('SETTINGS_MANAGE')
  @AuditLog('SETTINGS_CHANGED', 'SupportTicket', { entityIdParam: 'id' })
  @ApiOperation({ summary: 'Send a reply to a ticket' })
  @ApiOkResponseData(SupportMessageResponseDto)
  async sendReply(
    @Param('id') id: string,
    @Body() dto: SendReplyDto,
    @CurrentAdmin() admin: AdminSessionData,
  ) {
    return this.supportService.sendReply(id, dto, admin.adminId)
  }

  @Patch('tickets/:id/status')
  @Permissions('SETTINGS_MANAGE')
  @AuditLog('SETTINGS_CHANGED', 'SupportTicket', { entityIdParam: 'id' })
  @ApiOperation({ summary: 'Change ticket status' })
  @ApiOkResponseData(SupportTicketResponseDto)
  async changeStatus(
    @Param('id') id: string,
    @Body() dto: ChangeStatusDto,
    @CurrentAdmin() _admin: AdminSessionData,
  ) {
    return this.supportService.changeStatus(id, dto)
  }

  @Patch('tickets/:id/assignee')
  @Permissions('SETTINGS_MANAGE')
  @AuditLog('SETTINGS_CHANGED', 'SupportTicket', { entityIdParam: 'id' })
  @ApiOperation({ summary: 'Change ticket assignee' })
  @ApiOkResponseData(SupportTicketResponseDto)
  async changeAssignee(
    @Param('id') id: string,
    @Body() dto: ChangeAssigneeDto,
    @CurrentAdmin() _admin: AdminSessionData,
  ) {
    return this.supportService.changeAssignee(id, dto)
  }
}
