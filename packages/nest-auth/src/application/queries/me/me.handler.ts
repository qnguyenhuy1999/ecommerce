import { Inject } from '@nestjs/common'
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'

import { MeQuery } from './me.query'
import type { UserEntity } from '../../../domain/entities/user.entity'
import { USER_REPOSITORY, IUserRepository } from '../../../domain/ports/user.repository.port'

@QueryHandler(MeQuery)
export class MeHandler implements IQueryHandler<MeQuery, UserEntity | null> {
  constructor(@Inject(USER_REPOSITORY) private readonly userRepo: IUserRepository) {}
  async execute(query: MeQuery): Promise<UserEntity | null> {
    return this.userRepo.findById(query.userId)
  }
}
