import {
  Body,
  Controller,
  Delete,
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

import { CartDomainExceptionFilter } from './filters/cart-exception.filter'
import { AddCartItemCommand } from '../application/commands/add-cart-item/add-cart-item.command'
import type { AddCartItemResult } from '../application/commands/add-cart-item/add-cart-item.handler'
import { ClearCartCommand } from '../application/commands/clear-cart/clear-cart.command'
import { RemoveCartItemCommand } from '../application/commands/remove-cart-item/remove-cart-item.command'
import { UpdateCartItemCommand } from '../application/commands/update-cart-item/update-cart-item.command'
import { AddCartItemDto } from '../application/dtos/add-cart-item.dto'
import { UpdateCartItemDto } from '../application/dtos/update-cart-item.dto'
import { GetCartQuery } from '../application/queries/get-cart/get-cart.query'
import type { CartItemView, CartView } from '../application/views/cart.view'

interface SuccessEnvelope<T> {
  success: true
  data: T
}

@ApiTags('cart')
@Controller('cart')
@UseGuards(JwtAccessGuard)
@UseFilters(CartDomainExceptionFilter)
@ApiCookieAuth('access_token')
export class CartController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get()
  @ApiOperation({ summary: "Get the current user's cart" })
  @ApiResponse({ status: 200, description: 'Cart view with items, seller groups, and totals.' })
  async getCart(@CurrentUser() user: AuthenticatedUser): Promise<SuccessEnvelope<CartView>> {
    const data = await this.queryBus.execute<GetCartQuery, CartView>(new GetCartQuery(user.userId))
    return { success: true, data }
  }

  @Post('items')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Add an item to the cart' })
  @ApiResponse({ status: 201, description: 'Cart item created or merged.' })
  @ApiResponse({ status: 400, description: 'INSUFFICIENT_STOCK | PRODUCT_NOT_ACTIVE' })
  @ApiResponse({ status: 404, description: 'VARIANT_NOT_FOUND' })
  async addItem(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: AddCartItemDto,
  ): Promise<SuccessEnvelope<AddCartItemResult>> {
    const data = await this.commandBus.execute<AddCartItemCommand, AddCartItemResult>(
      new AddCartItemCommand(user.userId, dto.variantId, dto.quantity),
    )
    return { success: true, data }
  }

  @Patch('items/:id')
  @ApiOperation({ summary: 'Update a cart item quantity' })
  @ApiResponse({ status: 200, description: 'Updated cart item view.' })
  @ApiResponse({ status: 400, description: 'INVALID_QUANTITY | INSUFFICIENT_STOCK' })
  @ApiResponse({ status: 403, description: 'NOT_CART_OWNER' })
  @ApiResponse({ status: 404, description: 'CART_ITEM_NOT_FOUND' })
  async updateItem(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body() dto: UpdateCartItemDto,
  ): Promise<SuccessEnvelope<CartItemView>> {
    const data = await this.commandBus.execute<UpdateCartItemCommand, CartItemView>(
      new UpdateCartItemCommand(user.userId, id, dto.quantity),
    )
    return { success: true, data }
  }

  @Delete('items/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remove an item from the cart' })
  @ApiResponse({ status: 204, description: 'Item removed.' })
  @ApiResponse({ status: 403, description: 'NOT_CART_OWNER' })
  @ApiResponse({ status: 404, description: 'CART_ITEM_NOT_FOUND' })
  async removeItem(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string): Promise<void> {
    await this.commandBus.execute(new RemoveCartItemCommand(user.userId, id))
  }

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Clear the current cart' })
  @ApiResponse({ status: 204, description: 'Cart cleared.' })
  async clearCart(@CurrentUser() user: AuthenticatedUser): Promise<void> {
    await this.commandBus.execute(new ClearCartCommand(user.userId))
  }
}
