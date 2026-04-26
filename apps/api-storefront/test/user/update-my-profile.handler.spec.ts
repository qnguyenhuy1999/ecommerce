import { Prisma } from '@prisma/client'

import { UpdateMyProfileCommand } from '../../src/modules/user/application/commands/update-my-profile/update-my-profile.command'
import { UpdateMyProfileHandler } from '../../src/modules/user/application/commands/update-my-profile/update-my-profile.handler'
import type { UserProfileView } from '../../src/modules/user/application/views/user-profile.view'
import {
  EmailAlreadyInUseException,
  UserNotFoundException,
} from '../../src/modules/user/domain/exceptions/user.exceptions'
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
    findProfile: jest.fn().mockResolvedValue(buildProfile()),
    updateProfile: jest.fn().mockImplementation(async (_id, data) => buildProfile({ ...data })),
    emailTaken: jest.fn().mockResolvedValue(false),
    ...overrides,
  }
}

describe('UpdateMyProfileHandler', () => {
  it('ignores unchanged email and does not call the database', async () => {
    const repo = buildRepo()
    const handler = new UpdateMyProfileHandler(repo)

    const result = await handler.execute(
      new UpdateMyProfileCommand('user-1', { email: 'buyer@example.com' }),
    )

    expect(repo.emailTaken).not.toHaveBeenCalled()
    expect(repo.updateProfile).not.toHaveBeenCalled()
    expect(result.email).toBe('buyer@example.com')
  })

  it('updates a buyer email after verifying it is not already taken', async () => {
    const repo = buildRepo({
      emailTaken: jest.fn().mockResolvedValue(false),
      updateProfile: jest
        .fn()
        .mockResolvedValue(buildProfile({ email: 'new@example.com', emailVerified: false })),
    })
    const handler = new UpdateMyProfileHandler(repo)

    const result = await handler.execute(
      new UpdateMyProfileCommand('user-1', { email: 'new@example.com' }),
    )

    expect(repo.emailTaken).toHaveBeenCalledWith('new@example.com', 'user-1')
    expect(repo.updateProfile).toHaveBeenCalledWith('user-1', { email: 'new@example.com' })
    expect(result.email).toBe('new@example.com')
    expect(result.emailVerified).toBe(false)
  })

  it('rejects an email that is already in use by another user', async () => {
    const repo = buildRepo({ emailTaken: jest.fn().mockResolvedValue(true) })
    const handler = new UpdateMyProfileHandler(repo)

    await expect(
      handler.execute(new UpdateMyProfileCommand('user-1', { email: 'taken@example.com' })),
    ).rejects.toBeInstanceOf(EmailAlreadyInUseException)
    expect(repo.updateProfile).not.toHaveBeenCalled()
  })

  it('translates a race-condition Prisma unique violation into EMAIL_ALREADY_IN_USE', async () => {
    const repo = buildRepo({
      emailTaken: jest.fn().mockResolvedValue(false),
      updateProfile: jest.fn().mockRejectedValue(
        new Prisma.PrismaClientKnownRequestError('Unique', {
          code: 'P2002',
          clientVersion: 'test',
          meta: { target: ['email'] },
        }),
      ),
    })
    const handler = new UpdateMyProfileHandler(repo)

    await expect(
      handler.execute(new UpdateMyProfileCommand('user-1', { email: 'race@example.com' })),
    ).rejects.toBeInstanceOf(EmailAlreadyInUseException)
  })

  it('throws USER_NOT_FOUND if the caller has been deleted since their token was issued', async () => {
    const repo = buildRepo({ findProfile: jest.fn().mockResolvedValue(null) })
    const handler = new UpdateMyProfileHandler(repo)

    await expect(
      handler.execute(new UpdateMyProfileCommand('ghost', { email: 'ghost@example.com' })),
    ).rejects.toBeInstanceOf(UserNotFoundException)
  })

  it('never forwards role/status/password/emailVerified to the repository', async () => {
    const repo = buildRepo({
      emailTaken: jest.fn().mockResolvedValue(false),
      updateProfile: jest
        .fn()
        .mockResolvedValue(buildProfile({ email: 'new@example.com', emailVerified: false })),
    })
    const handler = new UpdateMyProfileHandler(repo)

    // The DTO type only allows `email`, but the global ValidationPipe
    // strips unknown fields before they reach here. Simulate a request
    // body that somehow carried extra fields and prove the handler only
    // ever propagates whitelisted patch keys to the repository.
    const dangerousDto = {
      email: 'new@example.com',
      password: 'NewPass!',
      role: 'ADMIN',
      status: 'SUSPENDED',
      emailVerified: false,
    } as unknown as { email?: string }

    await handler.execute(new UpdateMyProfileCommand('user-1', dangerousDto))

    expect(repo.updateProfile).toHaveBeenCalledTimes(1)
    const patch = (repo.updateProfile as jest.Mock).mock.calls[0][1] as Record<string, unknown>
    expect(Object.keys(patch)).toEqual(['email'])
    expect(patch).not.toHaveProperty('role')
    expect(patch).not.toHaveProperty('status')
    expect(patch).not.toHaveProperty('password')
    expect(patch).not.toHaveProperty('emailVerified')
  })
})
