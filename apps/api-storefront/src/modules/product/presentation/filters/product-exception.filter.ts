import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common'
import type { Response } from 'express'

import {
  CategoryNotFoundException,
  InvalidPriceRangeException,
  KycNotApprovedException,
  NotProductOwnerException,
  ProductNotFoundException,
  SellerNotFoundException,
  SkuExistsException,
} from '../../domain/exceptions/product.exceptions'

type ProductDomainException =
  | CategoryNotFoundException
  | InvalidPriceRangeException
  | KycNotApprovedException
  | NotProductOwnerException
  | ProductNotFoundException
  | SellerNotFoundException
  | SkuExistsException

@Catch(
  CategoryNotFoundException,
  InvalidPriceRangeException,
  KycNotApprovedException,
  NotProductOwnerException,
  ProductNotFoundException,
  SellerNotFoundException,
  SkuExistsException,
)
export class ProductDomainExceptionFilter implements ExceptionFilter<ProductDomainException> {
  catch(exception: ProductDomainException, host: ArgumentsHost): void {
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

  private toStatus(exception: ProductDomainException): number {
    if (
      exception instanceof ProductNotFoundException ||
      exception instanceof CategoryNotFoundException ||
      exception instanceof SellerNotFoundException
    ) {
      return HttpStatus.NOT_FOUND
    }
    if (
      exception instanceof NotProductOwnerException ||
      exception instanceof KycNotApprovedException
    ) {
      return HttpStatus.FORBIDDEN
    }
    return HttpStatus.BAD_REQUEST
  }
}
