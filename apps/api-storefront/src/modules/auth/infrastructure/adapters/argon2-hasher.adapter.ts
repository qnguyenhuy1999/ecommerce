import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import * as argon2 from 'argon2'

import type { IPasswordHasher } from '../../domain/ports/password-hasher.port'

@Injectable()
export class Argon2HasherAdapter implements IPasswordHasher {
  constructor(private readonly config: ConfigService) {}

  async hash(plain: string): Promise<string> {
    return argon2.hash(plain, {
      type: argon2.argon2id,
      memoryCost: this.config.get<number>('argon2.memoryCost', 65536),
      timeCost: this.config.get<number>('argon2.timeCost', 3),
      parallelism: this.config.get<number>('argon2.parallelism', 4),
    })
  }

  async verify(plain: string, hash: string): Promise<boolean> {
    try {
      return await argon2.verify(hash, plain)
    } catch {
      return false
    }
  }
}
