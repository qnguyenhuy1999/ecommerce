import { Module } from '@nestjs/common'
import { BullModule } from '@nestjs/bullmq'
import { QUEUES } from '@ecom/shared/constants/queues'
import { ChatController } from './chat.controller'
import { ChatService } from './chat.service'
import { ChatGateway } from './chat.gateway'
import { AuthModule } from '../auth/auth.module'
import { ShopModule } from '../shop/shop.module'
import { ChatModule as EcomChatModule } from '@ecom/nestjs-core/chat/chat.module'

@Module({
  imports: [
    AuthModule,
    ShopModule,
    BullModule.registerQueue({ name: QUEUES.NOTIFICATION }),
    EcomChatModule,
  ],
  controllers: [ChatController],
  providers: [ChatService, ChatGateway],
  exports: [ChatService],
})
export class ChatModule {}
