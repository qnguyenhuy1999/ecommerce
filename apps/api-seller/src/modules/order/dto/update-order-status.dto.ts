import { IsEnum, IsOptional, IsString } from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { OrderStatus } from '@ecom/contracts/enums/order'

export class UpdateOrderStatusDto {
  @ApiProperty({ enum: OrderStatus, description: 'New order status' })
  @IsEnum(OrderStatus)
  status!: OrderStatus

  @ApiPropertyOptional({ description: 'Optional note for the status change' })
  @IsOptional()
  @IsString()
  note?: string
}
