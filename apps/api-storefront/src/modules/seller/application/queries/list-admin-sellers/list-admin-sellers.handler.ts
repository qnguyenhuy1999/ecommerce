import { Inject } from '@nestjs/common'
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'

import { ListAdminSellersQuery } from './list-admin-sellers.query'
import type { KycStatus } from '../../../domain/entities/seller.entity'
import {
  ISellerRepository,
  SELLER_REPOSITORY,
} from '../../../domain/ports/seller.repository.port'
import type { AdminSellerListPage } from '../../views/admin-seller.view'

@QueryHandler(ListAdminSellersQuery)
export class ListAdminSellersHandler
  implements IQueryHandler<ListAdminSellersQuery, AdminSellerListPage>
{
  constructor(@Inject(SELLER_REPOSITORY) private readonly sellers: ISellerRepository) {}

  async execute(query: ListAdminSellersQuery): Promise<AdminSellerListPage> {
    const { page, limit, kycStatus, search } = query.filters
    return this.sellers.listForAdmin({
      page,
      limit,
      kycStatus: kycStatus as KycStatus | undefined,
      search,
    })
  }
}
