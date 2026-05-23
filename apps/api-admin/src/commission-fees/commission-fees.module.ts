import { Module } from '@nestjs/common'
import { AuditLogsModule } from '../audit-logs/audit-logs.module'
import { CommissionFeesController } from './commission-fees.controller'
import { CommissionFeesService } from './commission-fees.service'

@Module({
  imports: [AuditLogsModule],
  controllers: [CommissionFeesController],
  providers: [CommissionFeesService],
})
export class CommissionFeesModule {}
