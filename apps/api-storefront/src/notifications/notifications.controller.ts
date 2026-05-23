import { Controller, Get, UseGuards } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import type { SessionData } from '@ecom/auth'
import { ApiAuth, ApiErrorResponses, ApiOkResponseData } from '@ecom/nestjs-core/openapi'
import { CurrentUser } from '../auth/decorators/current-user.decorator'
import { AuthGuard } from '../auth/guards/auth.guard'
import { NotificationsService } from './notifications.service'
import { UnreadCountDto } from './dto/notification.dto'

@ApiTags('Storefront/Notifications')
@ApiAuth()
@ApiErrorResponses()
@Controller('notifications')
@UseGuards(AuthGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get('unread-count')
  @ApiOperation({ summary: 'Get unread message count for current user' })
  @ApiOkResponseData(UnreadCountDto)
  async getUnreadCount(@CurrentUser() user: SessionData) {
    return this.notificationsService.getUnreadCount(user)
  }
}
