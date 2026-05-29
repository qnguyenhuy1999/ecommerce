import { Module } from '@nestjs/common'
import { DatabaseModule } from '@ecom/database'
import { RedisModule } from '@ecom/redis'

@Module({
  imports: [DatabaseModule, RedisModule],
})
export class ChatModule {}
