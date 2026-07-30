import { Module } from '@nestjs/common'
import { APP_GUARD } from '@nestjs/core'
import { JwtModule } from '@nestjs/jwt'

import { EnvService } from '@/env/env.service'
import { AuthGuard } from '@/guards/auth.guard'

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
          signOptions: { expiresIn: envService.get('JWT_EXPIRES_IN') },
        }
      },
    }),
  ],
  providers: [
    { provide: HashService, useClass: BcryptHashService },
    { provide: TokenService, useClass: JwtTokenService },
    { provide: APP_GUARD, useClass: AuthGuard },
  ],
  exports: [HashService, TokenService],
})
export class CryptoModule {}
