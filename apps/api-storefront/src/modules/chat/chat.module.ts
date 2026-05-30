import { Module } from '@nestjs/common'
import { AuthModule } from '../auth/auth.module'
import { ChatBuyerService } from './chat-buyer.service'
import { ChatController } from './chat.controller'
import { ChatGateway } from './chat.gateway'
import { ChatModule as EcomChatModule } from '@ecom/nestjs-core/chat/chat.module'

@Module({
  imports: [AuthModule, EcomChatModule],
  controllers: [ChatController],
  providers: [ChatBuyerService, ChatGateway],
  exports: [ChatBuyerService],
})
export class ChatModule {}
