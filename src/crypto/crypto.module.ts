import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'

import { EnvService } from '@/env/env.service'

import { BcryptHashService } from './bcrypt-hash.service'
import { HashService } from './hash.service'
import { JwtTokenService } from './jwt-token.service'
import { TokenService } from './token.service'

@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [EnvService],
      useFactory(envService: EnvService) {
        return {
          secret: envService.get('JWT_SECRET'),
        }
      },
    }),
  ],
  providers: [
    { provide: HashService, useClass: BcryptHashService },
    { provide: TokenService, useClass: JwtTokenService },
  ],
  exports: [HashService, TokenService],
})
export class CryptoModule {}
