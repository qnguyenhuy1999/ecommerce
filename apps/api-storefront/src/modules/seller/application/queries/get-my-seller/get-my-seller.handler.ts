import { Inject } from '@nestjs/common'
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'

import { GetMySellerQuery } from './get-my-seller.query'
import type { SellerEntity } from '../../../domain/entities/seller.entity'
import { SellerNotFoundException } from '../../../domain/exceptions/seller.exceptions'
import {
  ISellerRepository,
  SELLER_REPOSITORY,
} from '../../../domain/ports/seller.repository.port'

@QueryHandler(GetMySellerQuery)
export class GetMySellerHandler implements IQueryHandler<GetMySellerQuery, SellerEntity> {
  constructor(@Inject(SELLER_REPOSITORY) private readonly sellers: ISellerRepository) {}

  async execute(query: GetMySellerQuery): Promise<SellerEntity> {
    const seller = await this.sellers.findByUserId(query.userId)
    if (!seller) throw new SellerNotFoundException()
    return seller
  }
}
