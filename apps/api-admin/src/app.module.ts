import { getAdminThrottleConfig, getRedisConfig, getSmtpConfig } from '@ecom/config'
import { DatabaseModule } from '@ecom/database'
import { EmailModule } from '@ecom/email'
import { RedisModule } from '@ecom/redis'
import { Module } from '@nestjs/common'
import { APP_INTERCEPTOR } from '@nestjs/core'
import { ThrottlerModule } from '@nestjs/throttler'
import { BullModule } from '@nestjs/bullmq'
import { AuditLogsModule } from './modules/audit-logs/audit-logs.module'
import { AuthModule } from './modules/auth/auth.module'
import { BannersModule } from './modules/banners/banners.module'
import { CategoriesModule } from './modules/categories/categories.module'
import { AuditLogInterceptor } from './common/interceptors/audit-log.interceptor'
import { DashboardModule } from './modules/dashboard/dashboard.module'
import { NotificationsModule } from './modules/notifications/notifications.module'
import { OrdersModule } from './modules/orders/orders.module'
import { ProductsModule } from './modules/products/products.module'
import { PromotionsModule } from './modules/promotions/promotions.module'
import { RefundsModule } from './modules/refunds/refunds.module'
import { ReviewsModule } from './modules/reviews/reviews.module'
import { RolesModule } from './modules/roles/roles.module'
import { CommissionFeesModule } from './modules/commission-fees/commission-fees.module'
import { SupportModule } from './modules/support/support.module'
import { SellersModule } from './modules/sellers/sellers.module'
import { UsersModule } from './modules/users/users.module'
import { ChatModule } from './modules/chat/chat.module'
import { HealthModule } from './modules/health/health.module'

@Module({
  imports: [
    ThrottlerModule.forRoot({
      throttlers: [getAdminThrottleConfig()],
    }),
    RedisModule.forRoot(
      (() => {
        const redis = getRedisConfig()
        return {
          host: redis.host,
          port: redis.port,
          ...(redis.password !== undefined ? { password: redis.password } : {}),
        }
      })(),
    ),
    BullModule.forRoot({
      connection: (() => {
        const redis = getRedisConfig()
        return {
          host: redis.host,
          port: redis.port,
          ...(redis.password !== undefined ? { password: redis.password } : {}),
        }
      })(),
    }),
    EmailModule.forRoot(getSmtpConfig()),
    DatabaseModule,
    AuthModule,
    SellersModule,
    ChatModule,
    HealthModule,
    DashboardModule,
    AuditLogsModule,
    ProductsModule,
    CategoriesModule,
    OrdersModule,
    RefundsModule,
    UsersModule,
    PromotionsModule,
    BannersModule,
    NotificationsModule,
    ReviewsModule,
    RolesModule,
    CommissionFeesModule,
    SupportModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: AuditLogInterceptor,
    },
  ],
})
export class AppModule {}
