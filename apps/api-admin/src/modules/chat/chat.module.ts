import { Module } from '@nestjs/common'
import { AuthModule } from '../auth/auth.module'
import { ChatAdminService } from './chat-admin.service'
import { ChatController } from './chat.controller'
import { ChatGateway } from './chat.gateway'
import { ChatModule as EcomChatModule } from '@ecom/nestjs-core/chat/chat.module'

@Module({
  imports: [AuthModule, EcomChatModule],
  controllers: [ChatController],
  providers: [ChatAdminService, ChatGateway],
  exports: [ChatAdminService],
})
export class ChatModule {}
