import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseFilters,
  UseGuards,
} from '@nestjs/common'
import { CommandBus, QueryBus } from '@nestjs/cqrs'
import { ApiCookieAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'

import { type AuthenticatedUser, CurrentUser, JwtAccessGuard } from '@ecom/nest-auth'

import { SellerDomainExceptionFilter } from './filters/seller-exception.filter'
import {
  toSellerPublicView,
  toSellerResponse,
  type SellerPublicView,
  type SellerResponseView,
} from './mappers/seller-response.mapper'
import { RegisterSellerCommand } from '../application/commands/register-seller/register-seller.command'
import { UpdateSellerCommand } from '../application/commands/update-seller/update-seller.command'
import { RegisterSellerDto } from '../application/dtos/register-seller.dto'
import { UpdateSellerDto } from '../application/dtos/update-seller.dto'
import { GetMySellerQuery } from '../application/queries/get-my-seller/get-my-seller.query'
import { GetSellerQuery } from '../application/queries/get-seller/get-seller.query'
import { GetSellerConsoleQuery } from '../application/queries/get-seller-console/get-seller-console.query'
import type { SellerConsoleView } from '../application/views/seller-console.view'
import type { SellerEntity } from '../domain/entities/seller.entity'

interface SuccessEnvelope<T> {
  success: true
  data: T
}

@ApiTags('sellers')
@Controller('sellers')
@UseFilters(SellerDomainExceptionFilter)
export class SellerController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post('register')
  @UseGuards(JwtAccessGuard)
  @ApiCookieAuth('access_token')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register the current user as a seller (KYC pending).' })
  @ApiResponse({ status: 201, description: 'Seller created in PENDING state.' })
  @ApiResponse({ status: 400, description: 'STORE_NAME_EXISTS | SELLER_ALREADY_REGISTERED' })
  async register(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: RegisterSellerDto,
  ): Promise<SuccessEnvelope<SellerResponseView>> {
    const seller = await this.commandBus.execute<RegisterSellerCommand, SellerEntity>(
      new RegisterSellerCommand(user.userId, dto),
    )
    return { success: true, data: toSellerResponse(seller) }
  }

  @Get('me')
  @UseGuards(JwtAccessGuard)
  @ApiCookieAuth('access_token')
  @ApiOperation({ summary: 'Get the current user’s seller profile.' })
  @ApiResponse({ status: 200, description: 'Current seller profile.' })
  @ApiResponse({ status: 404, description: 'SELLER_NOT_FOUND' })
  async me(@CurrentUser() user: AuthenticatedUser): Promise<SuccessEnvelope<SellerResponseView>> {
    const seller = await this.queryBus.execute<GetMySellerQuery, SellerEntity>(
      new GetMySellerQuery(user.userId),
    )
    return { success: true, data: toSellerResponse(seller) }
  }

  @Get('me/console')
  @UseGuards(JwtAccessGuard)
  @ApiCookieAuth('access_token')
  @ApiOperation({ summary: 'Seller console summary for the current seller.' })
  async console(@CurrentUser() user: AuthenticatedUser): Promise<SuccessEnvelope<SellerConsoleView>> {
    const data = await this.queryBus.execute<GetSellerConsoleQuery, SellerConsoleView>(
      new GetSellerConsoleQuery(user.userId),
    )
    return { success: true, data }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get seller public profile.' })
  @ApiResponse({ status: 200, description: 'Public seller profile.' })
  @ApiResponse({ status: 404, description: 'SELLER_NOT_FOUND' })
  async findOne(@Param('id') id: string): Promise<SuccessEnvelope<SellerPublicView>> {
    const seller = await this.queryBus.execute<GetSellerQuery, SellerEntity>(new GetSellerQuery(id))
    return { success: true, data: toSellerPublicView(seller) }
  }

  @Patch(':id')
  @UseGuards(JwtAccessGuard)
  @ApiCookieAuth('access_token')
  @ApiOperation({ summary: 'Update seller profile (owner or admin).' })
  @ApiResponse({ status: 200, description: 'Updated seller profile.' })
  @ApiResponse({ status: 403, description: 'NOT_SELLER_OWNER' })
  @ApiResponse({ status: 404, description: 'SELLER_NOT_FOUND' })
  async update(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: UpdateSellerDto,
  ): Promise<SuccessEnvelope<SellerResponseView>> {
    const seller = await this.commandBus.execute<UpdateSellerCommand, SellerEntity>(
      new UpdateSellerCommand(id, user.userId, user.role, dto),
    )
    return { success: true, data: toSellerResponse(seller) }
  }
}
