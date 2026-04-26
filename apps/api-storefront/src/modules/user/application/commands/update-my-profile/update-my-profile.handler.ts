import { Inject } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { Prisma } from '@prisma/client'

import { UpdateMyProfileCommand } from './update-my-profile.command'
import {
  EmailAlreadyInUseException,
  UserNotFoundException,
} from '../../../domain/exceptions/user.exceptions'
import {
  IUserProfileRepository,
  USER_PROFILE_REPOSITORY,
  type UpdateUserProfileInput,
} from '../../../domain/ports/user-profile.repository.port'
import type { UserProfileView } from '../../views/user-profile.view'

@CommandHandler(UpdateMyProfileCommand)
export class UpdateMyProfileHandler
  implements ICommandHandler<UpdateMyProfileCommand, UserProfileView>
{
  constructor(
    @Inject(USER_PROFILE_REPOSITORY) private readonly profiles: IUserProfileRepository,
  ) {}

  async execute(command: UpdateMyProfileCommand): Promise<UserProfileView> {
    const existing = await this.profiles.findProfile(command.userId)
    if (!existing) throw new UserNotFoundException(command.userId)

    const patch = this.toPatch(existing, command.dto.email)

    // Nothing actually changed; return the current profile without hitting the DB.
    if (Object.keys(patch).length === 0) {
      return existing
    }

    if (patch.email !== undefined) {
      const taken = await this.profiles.emailTaken(patch.email, command.userId)
      if (taken) throw new EmailAlreadyInUseException(patch.email)
    }

    try {
      return await this.profiles.updateProfile(command.userId, patch)
    } catch (error) {
      throw this.mapPrismaError(error, patch.email)
    }
  }

  private toPatch(existing: UserProfileView, email: string | undefined): UpdateUserProfileInput {
    const patch: UpdateUserProfileInput = {}
    if (email !== undefined && email !== existing.email) {
      patch.email = email
    }
    return patch
  }

  private mapPrismaError(error: unknown, email: string | undefined): Error {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002' &&
      email !== undefined
    ) {
      return new EmailAlreadyInUseException(email)
    }
    return error instanceof Error ? error : new Error(String(error))
  }
}
