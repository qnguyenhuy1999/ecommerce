import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common'
import type { Response } from 'express'

import {
  NotNotificationOwnerException,
  NotificationNotFoundException,
} from '../../domain/exceptions/notification.exceptions'

type NotificationDomainException =
  | NotificationNotFoundException
  | NotNotificationOwnerException

@Catch(NotificationNotFoundException, NotNotificationOwnerException)
export class NotificationDomainExceptionFilter
  implements ExceptionFilter<NotificationDomainException>
{
  catch(exception: NotificationDomainException, host: ArgumentsHost): void {
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

  private toStatus(exception: NotificationDomainException): number {
    if (exception instanceof NotificationNotFoundException) {
      return HttpStatus.NOT_FOUND
    }
    return HttpStatus.FORBIDDEN
  }
}
