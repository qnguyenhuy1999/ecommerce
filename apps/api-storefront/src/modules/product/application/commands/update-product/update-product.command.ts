import type { UpdateProductDto } from '../../dtos/update-product.dto'

export class UpdateProductCommand {
  constructor(
    readonly productId: string,
    readonly userId: string,
    readonly dto: UpdateProductDto,
  ) {}
}
