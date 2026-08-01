import { HashService } from '@/crypto/hash.service'

export class FakeHashService implements HashService {
  hash(value: string): Promise<string> {
    return Promise.resolve(`hashed-${value}`)
  }

  compare(value: string, hashedValue: string): Promise<boolean> {
    return Promise.resolve(hashedValue === `hashed-${value}`)
  }
}
