import { Module, OnModuleInit } from '@nestjs/common'
import { collectDefaultMetrics } from 'prom-client'

import { MetricsController } from './metrics.controller'

// Wrapper to ensure default collectors are registered exactly once per process.
// `collectDefaultMetrics` has module-level state inside prom-client, so we
// guard with a static flag to survive hot-reload in dev.
let defaultsRegistered = false

@Module({
  controllers: [MetricsController],
})
export class MetricsModule implements OnModuleInit {
  onModuleInit(): void {
    if (defaultsRegistered) return
    collectDefaultMetrics({
      // `service` label lets us split dashboards when we add the worker's
      // /metrics endpoint (see follow-up PR).
      labels: { service: 'api-storefront' },
    })
    defaultsRegistered = true
  }
}
