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
  UseGuards,
} from '@nestjs/common'
import { CommandBus, QueryBus } from '@nestjs/cqrs'
import { ApiCookieAuth, ApiOperation, ApiTags } from '@nestjs/swagger'

import { CurrentUser, JwtAccessGuard } from '@ecom/nest-auth'

import { AddCartItemCommand } from '../application/commands/add-cart-item/add-cart-item.command'
import type { AddCartItemResult } from '../application/commands/add-cart-item/add-cart-item.handler'
import { ClearCartCommand } from '../application/commands/clear-cart/clear-cart.command'
import { RemoveCartItemCommand } from '../application/commands/remove-cart-item/remove-cart-item.command'
import { UpdateCartItemCommand } from '../application/commands/update-cart-item/update-cart-item.command'
import { AddCartItemDto } from '../application/dtos/add-cart-item.dto'
import { UpdateCartItemDto } from '../application/dtos/update-cart-item.dto'
import { GetCartQuery } from '../application/queries/get-cart/get-cart.query'
import type { CartItemView, CartView } from '../application/views/cart.view'

interface AuthenticatedUser {
  userId: string
  email: string
  role: string
  jti: string
  exp: number
}

interface SuccessEnvelope<T> {
  success: true
  data: T
}

@ApiTags('cart')
@Controller('cart')
@UseGuards(JwtAccessGuard)
@ApiCookieAuth('access_token')
export class CartController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get()
  @ApiOperation({ summary: "Get the current user's cart" })
  async getCart(@CurrentUser() user: AuthenticatedUser): Promise<SuccessEnvelope<CartView>> {
    const data = await this.queryBus.execute<GetCartQuery, CartView>(new GetCartQuery(user.userId))
    return { success: true, data }
  }

  @Post('items')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Add an item to the cart' })
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
  async removeItem(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string): Promise<void> {
    await this.commandBus.execute(new RemoveCartItemCommand(user.userId, id))
  }

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Clear the current cart' })
  async clearCart(@CurrentUser() user: AuthenticatedUser): Promise<void> {
    await this.commandBus.execute(new ClearCartCommand(user.userId))
  }
}
