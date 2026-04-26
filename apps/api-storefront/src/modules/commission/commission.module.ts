import { Module } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'

import { AuthModule } from '@ecom/nest-auth'

import { AdminPayoutReportHandler } from './application/queries/admin-payout-report/admin-payout-report.handler'
import { ListSellerLedgerHandler } from './application/queries/list-seller-ledger/list-seller-ledger.handler'
import { COMMISSION_REPOSITORY } from './domain/ports/commission.repository.port'
import { PrismaCommissionRepository } from './infrastructure/repositories/prisma-commission.repository'
import { AdminCommissionController } from './presentation/admin-commission.controller'
import { CommissionController } from './presentation/commission.controller'

const QueryHandlers = [ListSellerLedgerHandler, AdminPayoutReportHandler]

@Module({
  imports: [CqrsModule, AuthModule],
  controllers: [CommissionController, AdminCommissionController],
  providers: [
    ...QueryHandlers,
    { provide: COMMISSION_REPOSITORY, useClass: PrismaCommissionRepository },
  ],
})
// eslint-disable-next-line @typescript-eslint/no-extraneous-class -- NestJS modules are DI containers with no instance members.
export class CommissionModule {}
