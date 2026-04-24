import type { CreateProductDto } from '../../dtos/create-product.dto'

export class CreateProductCommand {
  constructor(
    readonly userId: string,
    readonly dto: CreateProductDto,
  ) {}
}
