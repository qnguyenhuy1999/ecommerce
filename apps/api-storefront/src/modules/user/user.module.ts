import { Module } from '@nestjs/common'
import { UserController } from './user.controller'
import { UserService } from './user.service'
import { PrismaUserRepository } from '../auth/infrastructure/repositories/prisma-user.repository'
import { USER_REPOSITORY } from '../auth/domain/ports/user.repository.port'

@Module({
  controllers: [UserController],
  providers: [
    UserService,
    { provide: USER_REPOSITORY, useClass: PrismaUserRepository },
  ],
  exports: [UserService, USER_REPOSITORY, PrismaUserRepository],
})
export class UserModule {}
