import { Module } from '@nestjs/common'

import { CreateContactUseCase } from './application/create-contact.usecase'
import { DeleteContactUseCase } from './application/delete-contact.usecase'
import { FetchContactsUseCase } from './application/fetch-contacts.usecase'
import { GetContactUseCase } from './application/get-contact.usecase'
import { ContactsRepository } from './domain/contacts.repository'
import { ContactsPrismaRepository } from './infra/contacts-prisma.repository'
import { ContactsController } from './presentation/contacts.controller'
import { UsersModule } from '../users/users.module'
import { UpdateContactUseCase } from './application/update-contact.usecase'

@Module({
  imports: [UsersModule],
  controllers: [ContactsController],
  providers: [
    CreateContactUseCase,
    FetchContactsUseCase,
    GetContactUseCase,
    UpdateContactUseCase,
    DeleteContactUseCase,
    {
      provide: ContactsRepository,
      useClass: ContactsPrismaRepository,
    },
  ],
  exports: [ContactsRepository],
})
export class ContactsModule {}
