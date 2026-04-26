import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Query,
  UseFilters,
  UseGuards,
} from '@nestjs/common'
import { CommandBus, QueryBus } from '@nestjs/cqrs'
import { ApiCookieAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'

import { type AuthenticatedUser, CurrentUser, JwtAccessGuard } from '@ecom/nest-auth'

import { UpdateMyProfileCommand } from './application/commands/update-my-profile/update-my-profile.command'
import { UpdateMyProfileDto } from './application/dtos/update-my-profile.dto'
import { GetMyProfileQuery } from './application/queries/get-my-profile/get-my-profile.query'
import type { UserProfileView } from './application/views/user-profile.view'
import { UserDomainExceptionFilter } from './presentation/filters/user-exception.filter'
import { ListUserOrdersDto } from '../order/application/dtos/list-user-orders.dto'
import { ListUserOrdersQuery } from '../order/application/queries/list-user-orders/list-user-orders.query'
import type {
  OrderHistoryPage,
  OrderHistoryView,
} from '../order/application/views/order-history.view'

interface SuccessEnvelope<T> {
  success: true
  data: T
}

interface Paginated<T> {
  success: true
  data: T[]
  meta: { page: number; limit: number; total: number; totalPages: number }
}

@ApiTags('users')
@Controller('users')
@UseGuards(JwtAccessGuard)
@UseFilters(UserDomainExceptionFilter)
@ApiCookieAuth('access_token')
export class UserController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get('me')
  @ApiOperation({ summary: 'Get the authenticated user profile.' })
  @ApiResponse({ status: 200, description: 'Safe user profile for the current buyer.' })
  @ApiResponse({ status: 401, description: 'Missing or invalid access token.' })
  async getMe(@CurrentUser() user: AuthenticatedUser): Promise<SuccessEnvelope<UserProfileView>> {
    const data = await this.queryBus.execute<GetMyProfileQuery, UserProfileView>(
      new GetMyProfileQuery(user.userId),
    )
    return { success: true, data }
  }

  @Patch('me')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Update the authenticated user profile.',
    description:
      'Only whitelisted profile fields may be changed here. Role, status, emailVerified, and password are never settable through this endpoint.',
  })
  @ApiResponse({ status: 200, description: 'Updated safe user profile.' })
  @ApiResponse({ status: 400, description: 'Validation error (unknown or invalid fields).' })
  @ApiResponse({ status: 409, description: 'EMAIL_ALREADY_IN_USE' })
  async updateMe(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: UpdateMyProfileDto,
  ): Promise<SuccessEnvelope<UserProfileView>> {
    const data = await this.commandBus.execute<UpdateMyProfileCommand, UserProfileView>(
      new UpdateMyProfileCommand(user.userId, dto),
    )
    return { success: true, data }
  }

  @Get('me/orders')
  @ApiOperation({ summary: 'List the authenticated buyer’s orders, newest first by default.' })
  @ApiResponse({
    status: 200,
    description:
      'Paginated envelope of orders. Each order carries its number, status, totals, and per-seller suborders with items.',
  })
  async listMyOrders(
    @CurrentUser() user: AuthenticatedUser,
    @Query() dto: ListUserOrdersDto,
  ): Promise<Paginated<OrderHistoryView>> {
    const result = await this.queryBus.execute<ListUserOrdersQuery, OrderHistoryPage>(
      new ListUserOrdersQuery(user.userId, dto),
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
    }
  }
}
