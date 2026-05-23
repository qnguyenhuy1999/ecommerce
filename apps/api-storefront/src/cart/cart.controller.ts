import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import type { SessionData } from '@ecom/auth'
import { ApiAuth, ApiErrorResponses, ApiOkResponseData } from '@ecom/nestjs-core/openapi'
import { CurrentUser } from '../auth/decorators/current-user.decorator'
import { AuthGuard } from '../auth/guards/auth.guard'
import { CartService } from './cart.service'
import { AddCartItemDto, ApplyCartVoucherDto, CartCountDto, CartDto, UpdateCartItemDto } from './dto/cart.dto'

@ApiTags('Storefront/Cart')
@ApiAuth()
@ApiErrorResponses()
@Controller('cart')
@UseGuards(AuthGuard)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  @ApiOperation({ summary: 'Get current user cart' })
  @ApiOkResponseData(CartDto)
  async getCart(@CurrentUser() user: SessionData) {
    return this.cartService.getCart(user)
  }

  @Get('count')
  @ApiOperation({ summary: 'Get cart item count' })
  @ApiOkResponseData(CartCountDto)
  async getCartCount(@CurrentUser() user: SessionData) {
    return this.cartService.getCartCount(user)
  }

  @Post('items')
  @ApiOperation({ summary: 'Add product to cart' })
  @ApiOkResponseData(CartDto)
  async addItem(@CurrentUser() user: SessionData, @Body() dto: AddCartItemDto) {
    return this.cartService.addItem(user, dto)
  }

  @Patch('items/:itemId')
  @ApiOperation({ summary: 'Update cart item quantity' })
  @ApiOkResponseData(CartDto)
  async updateItem(
    @CurrentUser() user: SessionData,
    @Param('itemId') itemId: string,
    @Body() dto: UpdateCartItemDto,
  ) {
    return this.cartService.updateItem(user, itemId, dto)
  }

  @Delete('items/:itemId')
  @ApiOperation({ summary: 'Remove cart item' })
  @ApiOkResponseData(CartDto)
  async removeItem(@CurrentUser() user: SessionData, @Param('itemId') itemId: string) {
    return this.cartService.removeItem(user, itemId)
  }

  @Post('voucher')
  @ApiOperation({ summary: 'Apply platform voucher to cart' })
  @ApiOkResponseData(CartDto)
  async applyVoucher(@CurrentUser() user: SessionData, @Body() dto: ApplyCartVoucherDto) {
    return this.cartService.applyVoucher(user, dto)
  }

  @Delete('voucher')
  @ApiOperation({ summary: 'Remove platform voucher from cart' })
  @ApiOkResponseData(CartDto)
  async removeVoucher(@CurrentUser() user: SessionData) {
    return this.cartService.removeVoucher(user)
  }
}
