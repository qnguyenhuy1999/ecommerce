import type { PrismaClient } from '@prisma/client'

import { PrismaUserProfileRepository } from '../../src/modules/user/infrastructure/repositories/prisma-user-profile.repository'

describe('PrismaUserProfileRepository', () => {
  const createdAt = new Date('2026-04-20T00:00:00.000Z')
  const updatedAt = new Date('2026-04-25T00:00:00.000Z')

  const baseRow = {
    id: 'user-1',
    email: 'buyer@example.com',
    role: 'USER',
    status: 'ACTIVE',
    emailVerified: createdAt,
    createdAt,
    updatedAt,
  }

  function buildPrisma(overrides: {
    findUnique?: jest.Mock
    update?: jest.Mock
    count?: jest.Mock
  }) {
    return {
      user: {
        findUnique: overrides.findUnique ?? jest.fn(),
        update: overrides.update ?? jest.fn(),
        count: overrides.count ?? jest.fn(),
      },
    } as unknown as PrismaClient
  }

  it('selects only safe columns when loading a profile', async () => {
    const findUnique = jest.fn().mockResolvedValue(baseRow)
    const repo = new PrismaUserProfileRepository(buildPrisma({ findUnique }))

    const profile = await repo.findProfile('user-1')

    expect(findUnique).toHaveBeenCalledTimes(1)
    const args = findUnique.mock.calls[0][0] as { select: Record<string, boolean> }
    expect(args.select).toEqual({
      id: true,
      email: true,
      role: true,
      status: true,
      emailVerified: true,
      createdAt: true,
      updatedAt: true,
    })
    // Password must not be part of the select set — it is never fetched from
    // the database for this repository.
    expect(args.select).not.toHaveProperty('password')
    expect(profile?.emailVerified).toBe(true)
    expect(profile).not.toHaveProperty('password')
  })

  it('returns null when the user does not exist', async () => {
    const findUnique = jest.fn().mockResolvedValue(null)
    const repo = new PrismaUserProfileRepository(buildPrisma({ findUnique }))

    await expect(repo.findProfile('missing')).resolves.toBeNull()
  })

  it('resets emailVerified to null when updating the email', async () => {
    const update = jest.fn().mockResolvedValue({ ...baseRow, email: 'new@example.com', emailVerified: null })
    const repo = new PrismaUserProfileRepository(buildPrisma({ update }))

    const profile = await repo.updateProfile('user-1', { email: 'new@example.com' })

    const args = update.mock.calls[0][0] as {
      where: { id: string }
      data: Record<string, unknown>
    }
    expect(args.where).toEqual({ id: 'user-1' })
    expect(args.data).toEqual({ email: 'new@example.com', emailVerified: null })
    expect(profile.emailVerified).toBe(false)
  })

  it('does not touch email/emailVerified when no patch fields are provided', async () => {
    const update = jest.fn().mockResolvedValue(baseRow)
    const repo = new PrismaUserProfileRepository(buildPrisma({ update }))

    await repo.updateProfile('user-1', {})

    const args = update.mock.calls[0][0] as { data: Record<string, unknown> }
    expect(args.data).toEqual({})
  })

  it('excludes the current user from the email uniqueness check', async () => {
    const count = jest.fn().mockResolvedValue(0)
    const repo = new PrismaUserProfileRepository(buildPrisma({ count }))

    const taken = await repo.emailTaken('new@example.com', 'user-1')

    expect(taken).toBe(false)
    expect(count).toHaveBeenCalledWith({
      where: { email: 'new@example.com', NOT: { id: 'user-1' } },
    })
  })
})
