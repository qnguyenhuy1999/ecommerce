import { Module } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'

import { AuthModule } from '@ecom/nest-auth'

import { OrderModule } from '../order/order.module'
import { UpdateMyProfileHandler } from './application/commands/update-my-profile/update-my-profile.handler'
import { GetMyProfileHandler } from './application/queries/get-my-profile/get-my-profile.handler'
import { USER_PROFILE_REPOSITORY } from './domain/ports/user-profile.repository.port'
import { PrismaUserProfileRepository } from './infrastructure/repositories/prisma-user-profile.repository'
import { UserController } from './user.controller'

const CommandHandlers = [UpdateMyProfileHandler]
const QueryHandlers = [GetMyProfileHandler]

@Module({
  imports: [CqrsModule, AuthModule, OrderModule],
  controllers: [UserController],
  providers: [
    ...CommandHandlers,
    ...QueryHandlers,
    { provide: USER_PROFILE_REPOSITORY, useClass: PrismaUserProfileRepository },
  ],
  exports: [USER_PROFILE_REPOSITORY],
})
// eslint-disable-next-line @typescript-eslint/no-extraneous-class -- NestJS module class requires empty body
export class UserModule {}
