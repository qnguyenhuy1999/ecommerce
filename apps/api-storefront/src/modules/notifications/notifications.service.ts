import { PrismaService } from '@ecom/database'
import { BaseNotificationService } from '@ecom/nestjs-core/notification'
import { Injectable } from '@nestjs/common'

@Injectable()
export class NotificationsService extends BaseNotificationService {
  constructor(prisma: PrismaService) {
    super(prisma)
  }

  protected getModel() {
    return this.prisma.userNotification
  }

  protected getSubjectKey(): 'userId' | 'shopId' {
    return 'userId'
  }
}
