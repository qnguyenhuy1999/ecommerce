import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common'
import type { Response } from 'express'

import {
  NotSellerOwnerException,
  SellerAlreadyRegisteredException,
  SellerKycNotPendingException,
  SellerNotFoundException,
  StoreNameExistsException,
} from '../../domain/exceptions/seller.exceptions'

type SellerDomainException =
  | NotSellerOwnerException
  | SellerAlreadyRegisteredException
  | SellerKycNotPendingException
  | SellerNotFoundException
  | StoreNameExistsException

@Catch(
  NotSellerOwnerException,
  SellerAlreadyRegisteredException,
  SellerKycNotPendingException,
  SellerNotFoundException,
  StoreNameExistsException,
)
export class SellerDomainExceptionFilter implements ExceptionFilter<SellerDomainException> {
  catch(exception: SellerDomainException, host: ArgumentsHost): void {
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

  private toStatus(exception: SellerDomainException): number {
    if (exception instanceof SellerNotFoundException) {
      return HttpStatus.NOT_FOUND
    }
    if (exception instanceof NotSellerOwnerException) {
      return HttpStatus.FORBIDDEN
    }
    // STORE_NAME_EXISTS, SELLER_ALREADY_REGISTERED, SELLER_KYC_NOT_PENDING
    return HttpStatus.BAD_REQUEST
  }
}
