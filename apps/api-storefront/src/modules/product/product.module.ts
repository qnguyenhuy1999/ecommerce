import { Module } from '@nestjs/common'

import { AuthModule } from '@ecom/nest-auth'

import { ProductController } from './product.controller'
import { ProductService } from './product.service'

@Module({
  imports: [AuthModule],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService],
})
// eslint-disable-next-line @typescript-eslint/no-extraneous-class -- NestJS modules are DI containers with no instance members.
export class ProductModule {}
