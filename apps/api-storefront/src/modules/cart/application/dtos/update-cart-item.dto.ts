import { ApiProperty } from '@nestjs/swagger'
import { IsInt, Min } from 'class-validator'

export class UpdateCartItemDto {
  @ApiProperty({ description: 'New quantity for the cart item (must be >= 1)', minimum: 1 })
  @IsInt()
  @Min(1)
  quantity!: number
}
