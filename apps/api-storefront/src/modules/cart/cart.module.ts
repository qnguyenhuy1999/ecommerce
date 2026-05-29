import { Module } from '@nestjs/common'
import { AuthModule } from '../auth/auth.module'
import { CartController } from './cart.controller'
import { CartService } from './cart.service'
import { CartRepository } from './repositories/cart.repository'

@Module({
  imports: [AuthModule],
  controllers: [CartController],
  providers: [CartService, CartRepository],
})
export class CartModule {}
