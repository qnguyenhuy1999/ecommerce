import { Inject } from '@nestjs/common'
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'

import { GetMyProfileQuery } from './get-my-profile.query'
import { UserNotFoundException } from '../../../domain/exceptions/user.exceptions'
import {
  IUserProfileRepository,
  USER_PROFILE_REPOSITORY,
} from '../../../domain/ports/user-profile.repository.port'
import type { UserProfileView } from '../../views/user-profile.view'

@QueryHandler(GetMyProfileQuery)
export class GetMyProfileHandler implements IQueryHandler<GetMyProfileQuery, UserProfileView> {
  constructor(
    @Inject(USER_PROFILE_REPOSITORY) private readonly profiles: IUserProfileRepository,
  ) {}

  async execute(query: GetMyProfileQuery): Promise<UserProfileView> {
    const profile = await this.profiles.findProfile(query.userId)
    if (!profile) throw new UserNotFoundException(query.userId)
    return profile
  }
}
