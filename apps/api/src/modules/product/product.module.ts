import { Module } from '@nestjs/common';

import { ProductController } from './product.controller';
import { ProductService } from './product.service';

 
@Module({
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService],
})
 

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class ProductModule {}