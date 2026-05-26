import { Module } from '@nestjs/common'
import { AuthModule } from '../auth/auth.module'
import { ChatAdminService } from './chat-admin.service'
import { ChatGateway } from './chat.gateway'

@Module({
  imports: [AuthModule],
  providers: [ChatAdminService, ChatGateway],
  exports: [ChatAdminService],
})
export class ChatModule {}
