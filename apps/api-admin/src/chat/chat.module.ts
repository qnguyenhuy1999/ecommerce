import { Module } from '@nestjs/common'
import { AuthModule } from '../auth/auth.module'
import { ChatAdminService } from './chat-admin.service'
import { ChatController } from './chat.controller'
import { ChatGateway } from './chat.gateway'

@Module({
  imports: [AuthModule],
  controllers: [ChatController],
  providers: [ChatAdminService, ChatGateway],
  exports: [ChatAdminService],
})
export class ChatModule {}
