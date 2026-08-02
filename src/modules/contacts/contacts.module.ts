import { Module } from '@nestjs/common'

import { CreateContactUseCase } from './application/create-contact.usecase'
import { ContactsRepository } from './domain/contacts.repository'
import { ContactsPrismaRepository } from './infra/contacts-prisma.repository'
import { ContactsController } from './presentation/contacts.controller'
import { UsersRepository } from '../users/domain/users.repository'
import { UsersPrismaRepository } from '../users/infra/users-prisma.repository'

@Module({
  controllers: [ContactsController],
  providers: [
    CreateContactUseCase,
    {
      provide: ContactsRepository,
      useClass: ContactsPrismaRepository,
    },
    {
      provide: UsersRepository,
      useClass: UsersPrismaRepository,
    },
  ],
  exports: [ContactsRepository],
})
export class ContactsModule {}
