import { Inject } from '@nestjs/common'
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'

import { GetCartQuery } from './get-cart.query'
import { CART_CACHE, ICartCache } from '../../../domain/ports/cart-cache.port'
import { CART_REPOSITORY, ICartRepository } from '../../../domain/ports/cart.repository.port'
import { CartViewService } from '../../services/cart-view.service'
import type { CartView } from '../../views/cart.view'

const CART_CACHE_TTL_SECONDS = 86400

@QueryHandler(GetCartQuery)
export class GetCartHandler implements IQueryHandler<GetCartQuery, CartView> {
  constructor(
    @Inject(CART_REPOSITORY) private readonly cartRepo: ICartRepository,
    @Inject(CART_CACHE) private readonly cartCache: ICartCache,
    private readonly cartViewService: CartViewService,
  ) {}

  async execute(query: GetCartQuery): Promise<CartView> {
    const cached = await this.cartCache.get(query.userId)
    if (cached) return cached

    const cart =
      (await this.cartRepo.findByUserIdWithItems(query.userId)) ??
      (await this.cartRepo.createForUser(query.userId))

    const view = this.cartViewService.toView(cart)
    await this.cartCache.set(query.userId, view, CART_CACHE_TTL_SECONDS)
    return view
  }
}
