import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common'
import type { Response } from 'express'

import {
  ReservationNotActiveException,
  ReservationNotFoundException,
  ReservationStockMismatchException,
  StockAdjustmentInvalidException,
  VariantNotFoundException,
} from '../../domain/exceptions/inventory.exceptions'

type InventoryDomainException =
  | ReservationNotActiveException
  | ReservationNotFoundException
  | ReservationStockMismatchException
  | StockAdjustmentInvalidException
  | VariantNotFoundException

@Catch(
  ReservationNotActiveException,
  ReservationNotFoundException,
  ReservationStockMismatchException,
  StockAdjustmentInvalidException,
  VariantNotFoundException,
)
export class InventoryDomainExceptionFilter implements ExceptionFilter<InventoryDomainException> {
  catch(exception: InventoryDomainException, host: ArgumentsHost): void {
    const response = host.switchToHttp().getResponse<Response>()
    response.status(this.toStatus(exception)).json({
      success: false,
      error: {
        code: exception.code,
        message: exception.message,
      },
    })
  }

  private toStatus(exception: InventoryDomainException): number {
    if (
      exception instanceof ReservationNotFoundException ||
      exception instanceof VariantNotFoundException
    ) {
      return HttpStatus.NOT_FOUND
    }
    if (
      exception instanceof ReservationNotActiveException ||
      exception instanceof ReservationStockMismatchException
    ) {
      return HttpStatus.CONFLICT
    }
    return HttpStatus.BAD_REQUEST
  }
}
