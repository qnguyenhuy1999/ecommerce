import { Inject } from '@nestjs/common'
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'

import { GetSellerQuery } from './get-seller.query'
import type { SellerEntity } from '../../../domain/entities/seller.entity'
import { SellerNotFoundException } from '../../../domain/exceptions/seller.exceptions'
import {
  ISellerRepository,
  SELLER_REPOSITORY,
} from '../../../domain/ports/seller.repository.port'

@QueryHandler(GetSellerQuery)
export class GetSellerHandler implements IQueryHandler<GetSellerQuery, SellerEntity> {
  constructor(@Inject(SELLER_REPOSITORY) private readonly sellers: ISellerRepository) {}

  async execute(query: GetSellerQuery): Promise<SellerEntity> {
    const seller = await this.sellers.findById(query.sellerId)
    if (!seller) throw new SellerNotFoundException(query.sellerId)
    return seller
  }
}
