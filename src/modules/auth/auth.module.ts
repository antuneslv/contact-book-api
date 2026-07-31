import { Module } from '@nestjs/common'
import { APP_GUARD } from '@nestjs/core'

import { CryptoModule } from '@/crypto/crypto.module'
import { AuthGuard } from '@/guards/auth.guard'

import { UsersModule } from '../users/users.module'
import { AuthenticateUserUseCase } from './application/authenticate-user.usecase'
import { AuthController } from './presentation/auth.controller'

@Module({
  imports: [CryptoModule, UsersModule],
  controllers: [AuthController],
  providers: [
    AuthenticateUserUseCase,
    { provide: APP_GUARD, useClass: AuthGuard },
  ],
})
export class AuthModule {}
