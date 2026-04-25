import { ApiProperty } from '@nestjs/swagger'
import { IsInt, Max, Min } from 'class-validator'

import { MAX_CART_ITEM_QUANTITY } from './add-cart-item.dto'

export class UpdateCartItemDto {
  @ApiProperty({
    description: 'New quantity for the cart item (must be between 1 and 9999 inclusive)',
    minimum: 1,
    maximum: MAX_CART_ITEM_QUANTITY,
  })
  @IsInt()
  @Min(1)
  @Max(MAX_CART_ITEM_QUANTITY)
  quantity!: number
}
