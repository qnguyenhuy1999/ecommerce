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
import { ApiCookieAuth, ApiOperation, ApiTags } from '@nestjs/swagger'

import { CurrentUser, JwtAccessGuard } from '@ecom/nest-auth'

import { CartService } from './cart.service'
import { AddCartItemDto } from './dto/add-cart-item.dto'
import { UpdateCartItemDto } from './dto/update-cart-item.dto'

interface AuthenticatedUser {
  userId: string
  email: string
  role: string
  jti: string
  exp: number
}

@ApiTags('cart')
@Controller('cart')
@UseGuards(JwtAccessGuard)
@ApiCookieAuth('access_token')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  @ApiOperation({ summary: "Get the current user's cart" })
  async getCart(@CurrentUser() user: AuthenticatedUser) {
    const data = await this.cartService.getCart(user.userId)
    return { success: true, data }
  }

  @Post('items')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Add an item to the cart' })
  async addItem(@CurrentUser() user: AuthenticatedUser, @Body() dto: AddCartItemDto) {
    const data = await this.cartService.addItem(user.userId, dto)
    return { success: true, data }
  }

  @Patch('items/:id')
  @ApiOperation({ summary: 'Update a cart item quantity' })
  async updateItem(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body() dto: UpdateCartItemDto,
  ) {
    const data = await this.cartService.updateItem(user.userId, id, dto)
    return { success: true, data }
  }

  @Delete('items/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remove an item from the cart' })
  async removeItem(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string): Promise<void> {
    await this.cartService.removeItem(user.userId, id)
  }

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Clear the current cart' })
  async clearCart(@CurrentUser() user: AuthenticatedUser): Promise<void> {
    await this.cartService.clearCart(user.userId)
  }
}
