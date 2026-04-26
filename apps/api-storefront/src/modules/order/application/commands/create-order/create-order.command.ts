import type { ShippingAddressDto } from '../../dtos/create-order.dto'

export class CreateOrderCommand {
  constructor(
    readonly userId: string,
    readonly shippingAddress: ShippingAddressDto,
  ) {}
}
