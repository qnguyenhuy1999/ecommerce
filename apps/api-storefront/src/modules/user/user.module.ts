import { Module } from '@nestjs/common'

import { UserController } from './user.controller'
import { UserService } from './user.service'
import { USER_REPOSITORY } from '../auth/domain/ports/user.repository.port'
import { PrismaUserRepository } from '../auth/infrastructure/repositories/prisma-user.repository'

@Module({
  controllers: [UserController],
  providers: [UserService, { provide: USER_REPOSITORY, useClass: PrismaUserRepository }],
  exports: [UserService, USER_REPOSITORY, PrismaUserRepository],
})
// eslint-disable-next-line @typescript-eslint/no-extraneous-class -- NestJS module class requires empty body
export class UserModule {}
