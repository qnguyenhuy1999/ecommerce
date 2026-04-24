import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { Inject, ConflictException } from '@nestjs/common'
import { RegisterCommand } from './register.command'
import { USER_REPOSITORY, IUserRepository } from '../../../domain/ports/user.repository.port'
import { PASSWORD_HASHER, IPasswordHasher } from '../../../domain/ports/password-hasher.port'
import { EmailAlreadyExistsException } from '../../../domain/exceptions/auth.exceptions'
import type { UserEntity } from '../../../domain/entities/user.entity'

@CommandHandler(RegisterCommand)
export class RegisterHandler implements ICommandHandler<RegisterCommand, UserEntity> {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepo: IUserRepository,
    @Inject(PASSWORD_HASHER) private readonly hasher: IPasswordHasher,
  ) {}

  async execute(command: RegisterCommand): Promise<UserEntity> {
    const exists = await this.userRepo.existsByEmail(command.email)
    if (exists) throw new ConflictException(new EmailAlreadyExistsException().message)
    const passwordHash = await this.hasher.hash(command.password)
    return this.userRepo.create({ email: command.email, passwordHash })
  }
}
