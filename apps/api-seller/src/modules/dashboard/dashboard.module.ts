import { Module } from '@nestjs/common'
import { AnalyticsModule } from '../analytics/analytics.module'
import { AuthModule } from '../auth/auth.module'
import { InventoryModule } from '../inventory/inventory.module'
import { NotificationModule } from '../notification/notification.module'
import { OrderModule } from '../order/order.module'
import { ReturnModule } from '../return/return.module'
import { ShopModule } from '../shop/shop.module'
import { DashboardController } from './dashboard.controller'
import { DashboardService } from './dashboard.service'

@Module({
  imports: [
    AuthModule,
    ShopModule,
    AnalyticsModule,
    InventoryModule,
    NotificationModule,
    OrderModule,
    ReturnModule,
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
