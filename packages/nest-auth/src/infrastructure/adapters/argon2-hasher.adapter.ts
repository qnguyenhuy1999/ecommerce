import { Inject, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { randomBytes, pbkdf2 as pbkdf2Cb, timingSafeEqual } from 'node:crypto'
import { promisify } from 'node:util'

import type { IPasswordHasher } from '../../domain/ports/password-hasher.port'

const pbkdf2 = promisify(pbkdf2Cb)
const PBKDF2_ITERATIONS = 120000
const PBKDF2_KEYLEN = 64
const PBKDF2_DIGEST = 'sha512'

function isArgon2Hash(hash: string): boolean {
  return hash.startsWith('$argon2')
}

async function hashWithPbkdf2(plain: string): Promise<string> {
  const salt = randomBytes(16).toString('hex')
  const derived = await pbkdf2(plain, salt, PBKDF2_ITERATIONS, PBKDF2_KEYLEN, PBKDF2_DIGEST)
  return `pbkdf2$${PBKDF2_ITERATIONS}$${salt}$${derived.toString('hex')}`
}

async function verifyPbkdf2(plain: string, hash: string): Promise<boolean> {
  const parts = hash.split('$')
  if (parts.length !== 4 || parts[0] !== 'pbkdf2') return false

  const iterations = Number(parts[1])
  const salt = parts[2]
  const expectedHex = parts[3]
  if (!Number.isInteger(iterations) || !salt || !expectedHex) return false

  const derived = await pbkdf2(plain, salt, iterations, expectedHex.length / 2, PBKDF2_DIGEST)
  const expected = Buffer.from(expectedHex, 'hex')
  return expected.length === derived.length && timingSafeEqual(expected, derived)
}

async function tryLoadArgon2(): Promise<null | typeof import('argon2')> {
  try {
    return await import('argon2')
  } catch {
    return null
  }
}

@Injectable()
export class Argon2HasherAdapter implements IPasswordHasher {
  constructor(@Inject(ConfigService) private readonly config: ConfigService) {}

  async hash(plain: string): Promise<string> {
    const argon2 = await tryLoadArgon2()
    if (argon2) {
      return argon2.hash(plain, {
        type: argon2.argon2id,
        memoryCost: this.config.get('argon2.memoryCost', 65536),
        timeCost: this.config.get('argon2.timeCost', 3),
        parallelism: this.config.get('argon2.parallelism', 4),
      })
    }

    return hashWithPbkdf2(plain)
  }

  async verify(plain: string, hash: string): Promise<boolean> {
    if (isArgon2Hash(hash)) {
      const argon2 = await tryLoadArgon2()
      if (!argon2) return false
      try {
        return await argon2.verify(hash, plain)
      } catch {
        return false
      }
    }

    try {
      return await verifyPbkdf2(plain, hash)
    } catch {
      return false
    }
  }
}
