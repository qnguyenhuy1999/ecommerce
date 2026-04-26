import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common'
import type { Response } from 'express'

import {
  EmailAlreadyInUseException,
  UserNotFoundException,
} from '../../domain/exceptions/user.exceptions'

type UserDomainException = EmailAlreadyInUseException | UserNotFoundException

@Catch(EmailAlreadyInUseException, UserNotFoundException)
export class UserDomainExceptionFilter implements ExceptionFilter<UserDomainException> {
  catch(exception: UserDomainException, host: ArgumentsHost): void {
    const response = host.switchToHttp().getResponse<Response>()
    response.status(this.toStatus(exception)).json({
      success: false,
      error: {
        code: exception.code,
        message: exception.message,
      },
    })
  }

  private toStatus(exception: UserDomainException): number {
    if (exception instanceof UserNotFoundException) {
      return HttpStatus.NOT_FOUND
    }
    // EMAIL_ALREADY_IN_USE
    return HttpStatus.CONFLICT
  }
}
