import { Module } from '@nestjs/common'

import { CryptoModule } from '@/crypto/crypto.module'

import { UsersModule } from '../users/users.module'
import { AuthenticateUserUseCase } from './application/authenticate-user.usecase'
import { AuthController } from './presentation/auth.controller'

@Module({
  imports: [CryptoModule, UsersModule],
  controllers: [AuthController],
  providers: [AuthenticateUserUseCase],
})
export class AuthModule {}
