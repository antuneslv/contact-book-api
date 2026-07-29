import { Module } from '@nestjs/common'

import { BcryptHashService } from './bcrypt-hash-service'
import { HashService } from './hash-service'

@Module({
  providers: [{ provide: HashService, useClass: BcryptHashService }],
  exports: [HashService],
})
export class CryptoModule {}
