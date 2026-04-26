import type { RegisterSellerDto } from '../../dtos/register-seller.dto'

export class RegisterSellerCommand {
  constructor(
    readonly userId: string,
    readonly dto: RegisterSellerDto,
  ) {}
}
