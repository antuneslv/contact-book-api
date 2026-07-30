import { Module } from '@nestjs/common'

import { CryptoModule } from '@/crypto/crypto.module'

import { CreateUserUseCase } from './application/create-user.usecase'
import { UsersRepository } from './domain/users.repository'
import { UsersPrismaRepository } from './infra/users-prisma.repository'
import { UsersController } from './presentation/users.controller'

@Module({
  imports: [CryptoModule],
  controllers: [UsersController],
  providers: [
    CreateUserUseCase,
    {
      provide: UsersRepository,
      useClass: UsersPrismaRepository,
    },
  ],
  exports: [UsersRepository],
})
export class UsersModule {}
