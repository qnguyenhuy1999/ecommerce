import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common'
import type { Response } from 'express'

import {
  CartEmptyException,
  CheckoutInsufficientStockException,
  CheckoutProductNotActiveException,
  InvalidOrderStatusTransitionException,
} from '../../domain/exceptions/order.exceptions'

type OrderDomainException =
  | CartEmptyException
  | CheckoutInsufficientStockException
  | CheckoutProductNotActiveException
  | InvalidOrderStatusTransitionException

@Catch(
  CartEmptyException,
  CheckoutInsufficientStockException,
  CheckoutProductNotActiveException,
  InvalidOrderStatusTransitionException,
)
export class OrderDomainExceptionFilter implements ExceptionFilter<OrderDomainException> {
  catch(exception: OrderDomainException, host: ArgumentsHost): void {
    const response = host.switchToHttp().getResponse<Response>()
    response.status(this.toStatus(exception)).json({
      success: false,
      error: {
        code: exception.code,
        message: exception.message,
      },
    })
  }

  private toStatus(exception: OrderDomainException): number {
    if (exception instanceof CheckoutInsufficientStockException) {
      return HttpStatus.CONFLICT
    }
    return HttpStatus.BAD_REQUEST
  }
}
