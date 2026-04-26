import type { AdminPayoutReportDto } from '../../dtos/admin-payout-report.dto'

export class AdminPayoutReportQuery {
  constructor(public readonly filters: AdminPayoutReportDto) {}
}
