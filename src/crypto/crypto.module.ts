import { Module } from '@nestjs/common'

import { BcryptHashService } from './bcrypt-hash-service'

@Module({
  providers: [BcryptHashService],
  exports: [BcryptHashService],
})
export class CryptoModule {}
