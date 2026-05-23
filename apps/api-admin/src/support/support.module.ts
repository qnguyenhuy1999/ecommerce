import { Module } from '@nestjs/common'
import { AuditLogsModule } from '../audit-logs/audit-logs.module'
import { SupportController } from './support.controller'
import { SupportService } from './support.service'

@Module({
  imports: [AuditLogsModule],
  controllers: [SupportController],
  providers: [SupportService],
})
export class SupportModule {}
