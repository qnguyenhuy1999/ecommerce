import { Module } from '@nestjs/common'
import { DatabaseModule } from '@ecom/database'
import { AuthModule } from '../auth/auth.module'
import { ProfileController } from './profile.controller'
import { ProfileService } from './profile.service'

@Module({
  imports: [DatabaseModule, AuthModule],
  controllers: [ProfileController],
  providers: [ProfileService],
})
export class ProfileModule {}
