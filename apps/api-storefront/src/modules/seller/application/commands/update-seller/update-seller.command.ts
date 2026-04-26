import type { UpdateSellerDto } from '../../dtos/update-seller.dto'

export class UpdateSellerCommand {
  constructor(
    readonly sellerId: string,
    readonly userId: string,
    readonly userRole: string,
    readonly dto: UpdateSellerDto,
  ) {}
}
