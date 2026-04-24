import { Module } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'

import { AuthModule } from '@ecom/nest-auth'

import { CreateProductHandler } from './application/commands/create-product/create-product.handler'
import { DeleteProductHandler } from './application/commands/delete-product/delete-product.handler'
import { UpdateProductHandler } from './application/commands/update-product/update-product.handler'
import { GetProductHandler } from './application/queries/get-product/get-product.handler'
import { ListProductsHandler } from './application/queries/list-products/list-products.handler'
import { ListProductVariantsHandler } from './application/queries/list-variants/list-variants.handler'
import { PRODUCT_REPOSITORY } from './domain/ports/product.repository.port'
import { SELLER_LOOKUP } from './domain/ports/seller-lookup.port'
import { PrismaProductRepository } from './infrastructure/repositories/prisma-product.repository'
import { PrismaSellerLookup } from './infrastructure/repositories/prisma-seller-lookup'
import { ProductController } from './presentation/product.controller'

const CommandHandlers = [CreateProductHandler, UpdateProductHandler, DeleteProductHandler]
const QueryHandlers = [ListProductsHandler, GetProductHandler, ListProductVariantsHandler]

@Module({
  imports: [CqrsModule, AuthModule],
  controllers: [ProductController],
  providers: [
    ...CommandHandlers,
    ...QueryHandlers,
    { provide: PRODUCT_REPOSITORY, useClass: PrismaProductRepository },
    { provide: SELLER_LOOKUP, useClass: PrismaSellerLookup },
  ],
  exports: [PRODUCT_REPOSITORY, SELLER_LOOKUP],
})
// eslint-disable-next-line @typescript-eslint/no-extraneous-class -- NestJS module class requires empty body
export class ProductModule {}
