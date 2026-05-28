import { Module } from '@nestjs/common'
import { DatabaseModule } from '@ecom/database'
import { NotificationProducer } from './notification.producer'

@Module({
  imports: [DatabaseModule],
  providers: [NotificationProducer],
  exports: [NotificationProducer],
})
export class NotificationModule {}
