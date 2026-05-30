import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import type { SessionData } from '@ecom/auth/session.service'
import { ApiAuth } from '@ecom/nestjs-core/openapi/decorators/api-auth.decorator'
import { ApiErrorResponses } from '@ecom/nestjs-core/openapi/decorators/api-error-responses.decorator'
import { ApiOkResponseData } from '@ecom/nestjs-core/openapi/decorators/api-response.decorator'
import { CurrentUser } from '../auth/decorators/current-user.decorator'
import { AuthGuard } from '../auth/guards/auth.guard'
import { ProfileService } from './profile.service'
import { ProfileDto, UpdateProfileDto } from './dto/profile.dto'

@ApiTags('Storefront/Profile')
@ApiAuth()
@ApiErrorResponses()
@Controller('profile')
@UseGuards(AuthGuard)
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get()
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiOkResponseData(ProfileDto)
  async getProfile(@CurrentUser() user: SessionData) {
    return this.profileService.getProfile(user)
  }

  @Patch()
  @ApiOperation({ summary: 'Update current user profile' })
  @ApiOkResponseData(ProfileDto)
  async updateProfile(@CurrentUser() user: SessionData, @Body() dto: UpdateProfileDto) {
    return this.profileService.updateProfile(user, dto)
  }
}
