import {
  Controller,
  Get,
  Post,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import type { SessionData } from '@ecom/auth'
import { AuthGuard } from '../auth/guards/auth.guard'
import { CurrentUser } from '../auth/decorators/current-user.decorator'
import {
  ApiOkResponseData,
  ApiPaginatedResponse,
  ApiErrorResponses,
  ApiAuth,
} from '@ecom/nestjs-core/openapi'
import { NotificationsService } from './notifications.service'
import type { NotificationQueryDto } from './dto/notification.dto'
import {
  MarkAllNotificationsReadDto,
  MarkNotificationReadDto,
  NotificationResponseDto,
  NotificationUnreadCountDto,
} from './dto/notification.dto'

@ApiTags('Storefront/Notifications')
@ApiAuth()
@ApiErrorResponses()
@Controller('notifications')
@UseGuards(AuthGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  @ApiPaginatedResponse(NotificationResponseDto)
  async list(@CurrentUser() user: SessionData, @Query() query: NotificationQueryDto) {
    return this.notificationsService.list(user.userId, query)
  }

  @Get('unread-count')
  @ApiOkResponseData(NotificationUnreadCountDto)
  async unreadCount(@CurrentUser() user: SessionData) {
    return this.notificationsService.getUnreadCount(user.userId)
  }

  @Post(':id/read')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponseData(MarkNotificationReadDto)
  async markAsRead(@CurrentUser() user: SessionData, @Param('id') id: string) {
    await this.notificationsService.markAsRead(user.userId, id)
    return { message: 'Marked as read' }
  }

  @Post('read-all')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponseData(MarkAllNotificationsReadDto)
  async markAllAsRead(@CurrentUser() user: SessionData) {
    return this.notificationsService.markAllAsRead(user.userId)
  }
}
