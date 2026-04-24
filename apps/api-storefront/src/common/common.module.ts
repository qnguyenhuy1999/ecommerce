import { Module } from '@nestjs/common'

import { IdempotencyInterceptor } from './interceptors/idempotency.interceptor'

// CommonModule exposes cross-cutting infra (interceptors, guards, filters) that
// many feature modules can opt into. It is intentionally NOT registered as a
// global interceptor — each handler opts in via the @Idempotent() decorator so
// the rollout is surgical and read endpoints are not affected.
@Module({
  providers: [IdempotencyInterceptor],
  exports: [IdempotencyInterceptor],
})
// eslint-disable-next-line @typescript-eslint/no-extraneous-class -- NestJS modules are DI containers with no instance members.
export class CommonModule {}
