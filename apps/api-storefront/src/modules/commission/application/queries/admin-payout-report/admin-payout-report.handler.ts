import { Inject } from '@nestjs/common'
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'

import { AdminPayoutReportQuery } from './admin-payout-report.query'
import {
  COMMISSION_REPOSITORY,
  ICommissionRepository,
} from '../../../domain/ports/commission.repository.port'
import type { PayoutReportPage } from '../../views/commission.view'

@QueryHandler(AdminPayoutReportQuery)
export class AdminPayoutReportHandler
  implements IQueryHandler<AdminPayoutReportQuery, PayoutReportPage>
{
  constructor(
    @Inject(COMMISSION_REPOSITORY) private readonly commissions: ICommissionRepository,
  ) {}

  async execute(query: AdminPayoutReportQuery): Promise<PayoutReportPage> {
    const { page, limit, sellerId, from, to } = query.filters
    return this.commissions.adminPayoutReport({
      page,
      limit,
      sellerId,
      from: from ? new Date(from) : undefined,
      to: to ? new Date(to) : undefined,
    })
  }
}
