import { Module } from '@nestjs/common'
import { AuthModule } from '../auth/auth.module'
import { ChatAdminService } from './chat-admin.service'
import { ChatController } from './chat.controller'
import { ChatGateway } from './chat.gateway'
import { ChatModule as EcomChatModule } from '@ecom/chat'

@Module({
  imports: [AuthModule, EcomChatModule],
  controllers: [ChatController],
  providers: [ChatAdminService, ChatGateway],
  exports: [ChatAdminService],
})
export class ChatModule {}
