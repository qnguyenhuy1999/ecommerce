import { Module } from '@nestjs/common';

import { CartController } from './cart.controller';
import { CartService } from './cart.service';

@Module({
  controllers: [CartController],
  providers: [CartService],
  exports: [CartService],
})
 

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class CartModule {}