import { Inject } from '@nestjs/common'
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'

import { ListSellerLedgerQuery } from './list-seller-ledger.query'
import {
  COMMISSION_REPOSITORY,
  ICommissionRepository,
} from '../../../domain/ports/commission.repository.port'
import type { SellerLedgerPage } from '../../views/commission.view'

@QueryHandler(ListSellerLedgerQuery)
export class ListSellerLedgerHandler
  implements IQueryHandler<ListSellerLedgerQuery, SellerLedgerPage>
{
  constructor(
    @Inject(COMMISSION_REPOSITORY) private readonly commissions: ICommissionRepository,
  ) {}

  async execute(query: ListSellerLedgerQuery): Promise<SellerLedgerPage> {
    return this.commissions.listSellerLedger({
      sellerId: query.sellerId,
      page: query.filters.page,
      limit: query.filters.limit,
    })
  }
}
