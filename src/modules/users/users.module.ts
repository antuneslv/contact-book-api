import { Module } from '@nestjs/common'

import { CryptoModule } from '@/crypto/crypto.module'

import { CreateUserUseCase } from './application/create-user.usecase'
import { DeleteUserUseCase } from './application/delete-user.usecase'
import { GetUserUseCase } from './application/get-user.usecase'
import { UpdateUserPasswordUseCase } from './application/update-user-password.usecase'
import { UpdateUserUseCase } from './application/update-user.usecase'
import { UsersRepository } from './domain/users.repository'
import { UsersPrismaRepository } from './infra/users-prisma.repository'
import { UsersController } from './presentation/users.controller'

@Module({
  imports: [CryptoModule],
  controllers: [UsersController],
  providers: [
    CreateUserUseCase,
    GetUserUseCase,
    UpdateUserUseCase,
    UpdateUserPasswordUseCase,
    DeleteUserUseCase,
    {
      provide: UsersRepository,
      useClass: UsersPrismaRepository,
    },
  ],
  exports: [UsersRepository],
})
export class UsersModule {}
