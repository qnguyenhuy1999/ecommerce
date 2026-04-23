import { Module } from '@nestjs/common';

import { ProductController } from './product.controller';
import { ProductService } from './product.service';

 
@Module({
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService],
})
 

// eslint-disable-next-line @typescript-eslint/no-extraneous-class -- NestJS modules are DI containers with no instance members.
export class ProductModule {}
