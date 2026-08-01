import { HashService } from '@/crypto/hash.service'

export class FakeHashService implements HashService {
  private static readonly PREFIX = 'hashed-'

  hash(value: string): Promise<string> {
    return Promise.resolve(`${FakeHashService.PREFIX}${value}`)
  }

  compare(value: string, hashedValue: string): Promise<boolean> {
    return Promise.resolve(hashedValue === `${FakeHashService.PREFIX}${value}`)
  }
}
