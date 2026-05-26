import { Module } from '@nestjs/common'
import { AuthModule } from '../auth/auth.module'
import { ChatBuyerService } from './chat-buyer.service'
import { ChatGateway } from './chat.gateway'

@Module({
  imports: [AuthModule],
  providers: [ChatBuyerService, ChatGateway],
  exports: [ChatBuyerService],
})
export class ChatModule {}
