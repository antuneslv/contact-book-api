import { Injectable } from '@nestjs/common'
import { compare, hash } from 'bcrypt'

import { HashService } from './hash.service'

@Injectable()
export class BcryptHashService implements HashService {
  private readonly SALT_ROUNDS = 12

  hash(value: string): Promise<string> {
    return hash(value, this.SALT_ROUNDS)
  }

  compare(value: string, hashedValue: string): Promise<boolean> {
    return compare(value, hashedValue)
  }
}
