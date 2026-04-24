import { Module } from '@nestjs/common'

import { PrismaUserRepository, USER_REPOSITORY } from '@ecom/nest-auth'

import { UserController } from './user.controller'
import { UserService } from './user.service'

@Module({
  controllers: [UserController],
  providers: [UserService, { provide: USER_REPOSITORY, useClass: PrismaUserRepository }],
  exports: [UserService, USER_REPOSITORY],
})
// eslint-disable-next-line @typescript-eslint/no-extraneous-class -- NestJS module class requires empty body
export class UserModule {}
