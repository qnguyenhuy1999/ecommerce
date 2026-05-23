import { Module } from '@nestjs/common'
import { ThrottlerModule } from '@nestjs/throttler'
import { RedisModule } from '@ecom/redis'
import { EmailModule } from '@ecom/email'
import { DatabaseModule } from '@ecom/database'
import { getDefaultThrottleConfig, getRedisConfig, getSmtpConfig } from '@ecom/config'
import { AuthModule } from './auth/auth.module'
import { CartModule } from './cart/cart.module'
import { AddressesModule } from './addresses/addresses.module'
import { CheckoutModule } from './checkout/checkout.module'
import { CategoryPageModule } from './categories/category-page.module'
import { HomepageModule } from './homepage/homepage.module'
import { ShopPageModule } from './shop-page/shop-page.module'
import { NotificationsModule } from './notifications/notifications.module'
import { ProfileModule } from './profile/profile.module'
import { ProductsModule } from './products/products.module'

@Module({
  imports: [
    ThrottlerModule.forRoot({
      throttlers: [getDefaultThrottleConfig()],
    }),
    RedisModule.forRoot(
      (() => {
        const { password, ...rest } = getRedisConfig()
        return password !== undefined ? { ...rest, password } : rest
      })(),
    ),
    EmailModule.forRoot(getSmtpConfig()),
    DatabaseModule,
    AuthModule,
    CartModule,
    AddressesModule,
    CheckoutModule,
    CategoryPageModule,
    HomepageModule,
    ProductsModule,
    ShopPageModule,
    NotificationsModule,
    ProfileModule,
  ],
})
export class AppModule {}
