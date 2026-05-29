import { Module } from '@nestjs/common'
import { ThrottlerModule } from '@nestjs/throttler'
import { RedisModule } from '@ecom/redis'
import { EmailModule } from '@ecom/email'
import { DatabaseModule } from '@ecom/database'
import { getDefaultThrottleConfig, getRedisConfig, getSmtpConfig } from '@ecom/config'
import { AuthModule } from './modules/auth/auth.module'
import { ShopModule } from './modules/shop/shop.module'
import { ProductModule } from './modules/product/product.module'
import { OrderModule } from './modules/order/order.module'
import { InventoryModule } from './modules/inventory/inventory.module'
import { ShippingModule } from './modules/shipping/shipping.module'
import { NotificationModule } from './modules/notification/notification.module'
import { CouponModule } from './modules/coupon/coupon.module'
import { AnalyticsModule } from './modules/analytics/analytics.module'
import { BulkModule } from './modules/bulk/bulk.module'
import { ReviewModule } from './modules/review/review.module'
import { ChatModule } from './modules/chat/chat.module'
import { ReturnModule } from './modules/return/return.module'
import { ApprovalModule } from './modules/approval/approval.module'
import { WarehouseModule } from './modules/warehouse/warehouse.module'
import { MetricsModule } from './modules/metrics/metrics.module'
import { SearchModule } from './modules/search/search.module'
import { QueueModule } from './modules/queue/queue.module'
import { FlashSaleModule } from './modules/flash-sale/flash-sale.module'
import { AdsModule } from './modules/ads/ads.module'
import { AffiliateModule } from './modules/affiliate/affiliate.module'
import { SubscriptionModule } from './modules/subscription/subscription.module'
import { LivestreamModule } from './modules/livestream/livestream.module'
import { AiToolsModule } from './modules/ai-tools/ai-tools.module'
import { RecommendationModule } from './modules/recommendation/recommendation.module'
import { LoyaltyModule } from './modules/loyalty/loyalty.module'
import { WalletModule } from './modules/wallet/wallet.module'
import { AdvancedSearchModule } from './modules/advanced-search/advanced-search.module'
import { AutomationModule } from './modules/automation/automation.module'
import { I18nModule } from './modules/i18n/i18n.module'
import { EventStreamingModule } from './modules/event-streaming/event-streaming.module'
import { GrowthModule } from './modules/growth/growth.module'

@Module({
  imports: [
    ThrottlerModule.forRoot({
      throttlers: [getDefaultThrottleConfig()],
    }),
    RedisModule.forRoot(
      (() => {
        const redis = getRedisConfig()
        const options: {
          host: string
          port: number
          password?: string
        } = {
          host: redis.host,
          port: redis.port,
        }

        if (redis.password !== undefined) {
          options.password = redis.password
        }

        return options
      })(),
    ),
    EmailModule.forRoot(getSmtpConfig()),
    DatabaseModule,
    AuthModule,
    ShopModule,
    ProductModule,
    OrderModule,
    InventoryModule,
    ShippingModule,
    NotificationModule,
    CouponModule,
    AnalyticsModule,
    BulkModule,
    ReviewModule,
    ChatModule,
    ReturnModule,
    ApprovalModule,
    WarehouseModule,
    MetricsModule,
    SearchModule,
    QueueModule,
    FlashSaleModule,
    AdsModule,
    AffiliateModule,
    SubscriptionModule,
    LivestreamModule,
    AiToolsModule,
    RecommendationModule,
    LoyaltyModule,
    WalletModule,
    AdvancedSearchModule,
    AutomationModule,
    I18nModule,
    EventStreamingModule,
    GrowthModule,
  ],
})
export class AppModule {}
