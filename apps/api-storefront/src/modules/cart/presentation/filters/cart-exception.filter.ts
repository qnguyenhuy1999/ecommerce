import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common'
import type { Response } from 'express'

import {
  CartItemNotFoundException,
  InsufficientStockException,
  InvalidQuantityException,
  NotCartOwnerException,
  ProductNotActiveException,
  VariantNotFoundException,
} from '../../domain/exceptions/cart.exceptions'

type CartDomainException =
  | CartItemNotFoundException
  | InsufficientStockException
  | InvalidQuantityException
  | NotCartOwnerException
  | ProductNotActiveException
  | VariantNotFoundException

@Catch(
  CartItemNotFoundException,
  InsufficientStockException,
  InvalidQuantityException,
  NotCartOwnerException,
  ProductNotActiveException,
  VariantNotFoundException,
)
export class CartDomainExceptionFilter implements ExceptionFilter<CartDomainException> {
  catch(exception: CartDomainException, host: ArgumentsHost): void {
    const response = host.switchToHttp().getResponse<Response>()
    const status = this.toStatus(exception)
    response.status(status).json({
      success: false,
      error: {
        code: exception.code,
        message: exception.message,
      },
    })
  }

  private toStatus(exception: CartDomainException): number {
    if (
      exception instanceof VariantNotFoundException ||
      exception instanceof CartItemNotFoundException
    ) {
      return HttpStatus.NOT_FOUND
    }
    if (exception instanceof NotCartOwnerException) {
      return HttpStatus.FORBIDDEN
    }
    return HttpStatus.BAD_REQUEST
  }
}
