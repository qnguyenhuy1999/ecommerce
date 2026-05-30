import { Module } from '@nestjs/common'
import { BullModule } from '@nestjs/bullmq'
import { EmailModule } from '@ecom/email'
import { getSmtpConfig } from '@ecom/config'
import { QUEUES } from '@ecom/shared/constants/queues'
import { ChannelRouterService } from './channels/channel-router.service'
import { EmailChannel } from './channels/email.channel'
import { InAppChannel } from './channels/in-app.channel'
import { NotificationProcessor } from './notification.processor'
import { PushChannel } from './channels/push.channel'

@Module({
  imports: [
    BullModule.registerQueue({ name: QUEUES.NOTIFICATION }),
    EmailModule.forRoot(getSmtpConfig()),
  ],
  providers: [NotificationProcessor, ChannelRouterService, InAppChannel, EmailChannel, PushChannel],
})
export class NotificationProcessorModule {}
