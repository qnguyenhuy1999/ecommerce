import { ApiProperty } from '@nestjs/swagger'
import { IsInt, IsNotEmpty, IsString, Max, Min } from 'class-validator'

/** Defensive cap on per-request quantity; real stock limits enforced by the handler. */
export const MAX_CART_ITEM_QUANTITY = 9_999

export class AddCartItemDto {
  @ApiProperty({ description: 'Product variant ID to add to the cart' })
  @IsString()
  @IsNotEmpty()
  variantId!: string

  @ApiProperty({
    description: 'Quantity to add (must be between 1 and 9999 inclusive)',
    minimum: 1,
    maximum: MAX_CART_ITEM_QUANTITY,
  })
  @IsInt()
  @Min(1)
  @Max(MAX_CART_ITEM_QUANTITY)
  quantity!: number
}
