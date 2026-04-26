import { GetMyProfileHandler } from '../../src/modules/user/application/queries/get-my-profile/get-my-profile.handler'
import { GetMyProfileQuery } from '../../src/modules/user/application/queries/get-my-profile/get-my-profile.query'
import type { UserProfileView } from '../../src/modules/user/application/views/user-profile.view'
import { UserNotFoundException } from '../../src/modules/user/domain/exceptions/user.exceptions'
import type { IUserProfileRepository } from '../../src/modules/user/domain/ports/user-profile.repository.port'

function buildProfile(overrides: Partial<UserProfileView> = {}): UserProfileView {
  return {
    id: 'user-1',
    email: 'buyer@example.com',
    role: 'USER',
    status: 'ACTIVE',
    emailVerified: true,
    createdAt: '2026-04-20T00:00:00.000Z',
    updatedAt: '2026-04-25T00:00:00.000Z',
    ...overrides,
  }
}

function buildRepo(overrides: Partial<IUserProfileRepository> = {}): IUserProfileRepository {
  return {
    findProfile: jest.fn(),
    updateProfile: jest.fn(),
    emailTaken: jest.fn(),
    ...overrides,
  }
}

describe('GetMyProfileHandler', () => {
  it('returns only safe profile fields for the authenticated user', async () => {
    const profile = buildProfile()
    const repo = buildRepo({ findProfile: jest.fn().mockResolvedValue(profile) })
    const handler = new GetMyProfileHandler(repo)

    const result = await handler.execute(new GetMyProfileQuery('user-1'))

    expect(repo.findProfile).toHaveBeenCalledWith('user-1')
    expect(result).toEqual(profile)
    // Regression: the view must never leak credential or token material.
    expect(Object.keys(result)).toEqual(
      expect.arrayContaining([
        'id',
        'email',
        'role',
        'status',
        'emailVerified',
        'createdAt',
        'updatedAt',
      ]),
    )
    expect(Object.keys(result)).not.toEqual(expect.arrayContaining(['password', 'passwordHash']))
  })

  it('throws USER_NOT_FOUND when the profile has been deleted', async () => {
    const repo = buildRepo({ findProfile: jest.fn().mockResolvedValue(null) })
    const handler = new GetMyProfileHandler(repo)

    await expect(handler.execute(new GetMyProfileQuery('missing-user'))).rejects.toBeInstanceOf(
      UserNotFoundException,
    )
  })
})
