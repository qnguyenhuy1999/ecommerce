import { ApiProperty } from '@nestjs/swagger'
import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator'

export class AddCartItemDto {
  @ApiProperty({ description: 'Product variant ID to add to the cart' })
  @IsString()
  @IsNotEmpty()
  variantId!: string

  @ApiProperty({ description: 'Quantity to add (must be >= 1)', minimum: 1 })
  @IsInt()
  @Min(1)
  quantity!: number
}
