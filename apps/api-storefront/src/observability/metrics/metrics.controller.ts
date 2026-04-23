import { Controller, Get, Header } from '@nestjs/common'
import { ApiExcludeController } from '@nestjs/swagger'
import { register } from 'prom-client'

/**
 * `/metrics` — Prometheus scrape endpoint.
 *
 * Exposes the default Node.js collectors (event loop lag, GC, heap, handle
 * counts, CPU) plus any custom metrics registered via MetricsService.
 *
 * Mounted outside `/api/v1` so scrapers don't have to know the API prefix,
 * and excluded from Swagger (it's ops, not public API).
 *
 * Auth: none by default; if Prometheus is outside the cluster, put this
 * behind a network policy / basic auth at the ingress.
 */
@ApiExcludeController()
@Controller('metrics')
export class MetricsController {
  @Get()
  @Header('Content-Type', register.contentType)
  async metrics(): Promise<string> {
    return await register.metrics()
  }
}
