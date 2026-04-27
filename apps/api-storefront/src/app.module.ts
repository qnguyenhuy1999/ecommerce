import { BullModule } from '@nestjs/bullmq'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ThrottlerModule } from '@nestjs/throttler'

import { PrismaModule } from '@ecom/database'
import { AuthModule } from '@ecom/nest-auth'

import { CommonModule } from './common/common.module'
import configuration from './config/configuration'
import { AdminModule } from './modules/admin/admin.module'
import { CartModule } from './modules/cart/cart.module'
import { CommissionModule } from './modules/commission/commission.module'
import { InventoryModule } from './modules/inventory/inventory.module'
import { NotificationModule } from './modules/notification/notification.module'
import { OrderModule } from './modules/order/order.module'
import { PaymentModule } from './modules/payment/payment.module'
import { ProductModule } from './modules/product/product.module'
import { ReviewModule } from './modules/review/review.module'
import { SellerModule } from './modules/seller/seller.module'
import { UserModule } from './modules/user/user.module'
import { ObservabilityModule } from './observability/observability.module'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 100 }]),
    BullModule.forRoot({
      connection: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379', 10),
      },
    }),
    PrismaModule,
    CommonModule,
    ObservabilityModule,
    AuthModule,
    UserModule,
    SellerModule,
    ProductModule,
    ReviewModule,
    InventoryModule,
    CartModule,
    CommissionModule,
    OrderModule,
    PaymentModule,
    NotificationModule,
    AdminModule,
  ],
})

// eslint-disable-next-line @typescript-eslint/no-extraneous-class -- NestJS modules are DI containers with no instance members.
export class AppModule {}
