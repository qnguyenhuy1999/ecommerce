import { Module } from '@nestjs/common'
import { TerminusModule } from '@nestjs/terminus'

import { HealthController } from './health.controller'

// Terminus provides the HealthCheck decorator + PrismaHealthIndicator etc.
// It does NOT require any config — indicators are injected per-check.
@Module({
  imports: [TerminusModule],
  controllers: [HealthController],
})
// eslint-disable-next-line @typescript-eslint/no-extraneous-class -- NestJS modules are DI containers with no instance members.
export class HealthModule {}
