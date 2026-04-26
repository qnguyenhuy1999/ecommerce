import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Query,
  UseFilters,
  UseGuards,
} from '@nestjs/common'
import { CommandBus, QueryBus } from '@nestjs/cqrs'
import { ApiCookieAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'

import { type AuthenticatedUser, CurrentUser, JwtAccessGuard } from '@ecom/nest-auth'

import { MarkNotificationReadCommand } from './application/commands/mark-notification-read/mark-notification-read.command'
import { ListNotificationsDto } from './application/dtos/list-notifications.dto'
import { ListNotificationsQuery } from './application/queries/list-notifications/list-notifications.query'
import type {
  MarkNotificationReadView,
  NotificationListPage,
  NotificationView,
} from './application/views/notification.view'
import { NotificationDomainExceptionFilter } from './presentation/filters/notification-exception.filter'

interface SuccessEnvelope<T> {
  success: true
  data: T
}

interface PaginatedNotifications {
  success: true
  data: NotificationView[]
  meta: { page: number; limit: number; total: number; totalPages: number }
  unreadCount: number
}

@ApiTags('notifications')
@Controller('notifications')
@UseGuards(JwtAccessGuard)
@UseFilters(NotificationDomainExceptionFilter)
@ApiCookieAuth('access_token')
export class NotificationController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get()
  @ApiOperation({ summary: 'List the authenticated user’s notifications, newest first.' })
  @ApiResponse({
    status: 200,
    description:
      'Paginated envelope of notifications with an aggregate `unreadCount` for the current user.',
  })
  @ApiResponse({ status: 401, description: 'Missing or invalid access token.' })
  async list(
    @CurrentUser() user: AuthenticatedUser,
    @Query() dto: ListNotificationsDto,
  ): Promise<PaginatedNotifications> {
    const result = await this.queryBus.execute<ListNotificationsQuery, NotificationListPage>(
      new ListNotificationsQuery(user.userId, dto),
    )
    return {
      success: true,
      data: result.data,
      meta: {
        page: result.page,
        limit: result.limit,
        total: result.total,
        totalPages: result.totalPages,
      },
      unreadCount: result.unreadCount,
    }
  }

  @Patch(':id/read')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Mark a notification as read (owner only).' })
  @ApiResponse({ status: 200, description: 'Notification marked as read.' })
  @ApiResponse({ status: 403, description: 'NOT_NOTIFICATION_OWNER' })
  @ApiResponse({ status: 404, description: 'NOTIFICATION_NOT_FOUND' })
  async markRead(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
  ): Promise<SuccessEnvelope<MarkNotificationReadView>> {
    const data = await this.commandBus.execute<
      MarkNotificationReadCommand,
      MarkNotificationReadView
    >(new MarkNotificationReadCommand(id, user.userId))
    return { success: true, data }
  }
}
