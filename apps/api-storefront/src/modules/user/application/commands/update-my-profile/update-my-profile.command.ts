import type { UpdateMyProfileDto } from '../../dtos/update-my-profile.dto'

export class UpdateMyProfileCommand {
  constructor(
    readonly userId: string,
    readonly dto: UpdateMyProfileDto,
  ) {}
}
