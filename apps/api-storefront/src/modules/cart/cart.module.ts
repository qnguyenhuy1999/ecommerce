import { Module } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'

import { AddCartItemHandler } from './application/commands/add-cart-item/add-cart-item.handler'
import { ClearCartHandler } from './application/commands/clear-cart/clear-cart.handler'
import { RemoveCartItemHandler } from './application/commands/remove-cart-item/remove-cart-item.handler'
import { UpdateCartItemHandler } from './application/commands/update-cart-item/update-cart-item.handler'
import { GetCartHandler } from './application/queries/get-cart/get-cart.handler'
import { CartViewService } from './application/services/cart-view.service'
import { CART_CACHE } from './domain/ports/cart-cache.port'
import { CART_REPOSITORY } from './domain/ports/cart.repository.port'
import { PRODUCT_VARIANT_REPOSITORY } from './domain/ports/product-variant.repository.port'
import { RedisCartCacheAdapter } from './infrastructure/adapters/redis-cart-cache.adapter'
import { PrismaCartRepository } from './infrastructure/repositories/prisma-cart.repository'
import { PrismaProductVariantRepository } from './infrastructure/repositories/prisma-product-variant.repository'
import { CartController } from './presentation/cart.controller'

const CommandHandlers = [
  AddCartItemHandler,
  UpdateCartItemHandler,
  RemoveCartItemHandler,
  ClearCartHandler,
]
const QueryHandlers = [GetCartHandler]

@Module({
  imports: [CqrsModule],
  controllers: [CartController],
  providers: [
    ...CommandHandlers,
    ...QueryHandlers,
    CartViewService,
    { provide: CART_REPOSITORY, useClass: PrismaCartRepository },
    { provide: PRODUCT_VARIANT_REPOSITORY, useClass: PrismaProductVariantRepository },
    { provide: CART_CACHE, useClass: RedisCartCacheAdapter },
  ],
  exports: [CART_CACHE],
})
// eslint-disable-next-line @typescript-eslint/no-extraneous-class -- NestJS modules are DI containers with no instance members.
export class CartModule {}
