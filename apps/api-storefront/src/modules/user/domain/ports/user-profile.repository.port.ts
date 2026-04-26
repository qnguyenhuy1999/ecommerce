import type { UserProfileView } from '../../application/views/user-profile.view'

export const USER_PROFILE_REPOSITORY = Symbol('USER_PROFILE_REPOSITORY')

export interface UpdateUserProfileInput {
  email?: string
}

export interface IUserProfileRepository {
  findProfile(userId: string): Promise<UserProfileView | null>
  updateProfile(userId: string, data: UpdateUserProfileInput): Promise<UserProfileView>
  emailTaken(email: string, excludeUserId: string): Promise<boolean>
}
