import { Injectable, NotFoundException } from '@nestjs/common'

import { UsersRepository } from '@/modules/users/domain/users.repository'
import { formatCalendarDate } from '@/utils/calendar-date'
import { Either, left, right } from '@/utils/either'

import {
  ContactCategory,
  ContactsRepository,
} from '../domain/contacts.repository'

type ContactItem = {
  id: string
  name: string
  phone: string
  email: string | null
  birthday: string | null
  category: ContactCategory | null
  observations: string | null
  createdAt: Date
  updatedAt: Date
}

type FetchContactsOutput = {
  contacts: ContactItem[]
}

type FetchContactsUseCaseResponse = Either<
  NotFoundException,
  FetchContactsOutput
>

@Injectable()
export class FetchContactsUseCase {
  constructor(
    private readonly contactsRepository: ContactsRepository,
    private readonly usersRepository: UsersRepository,
  ) {}

  async execute(userId: string): Promise<FetchContactsUseCaseResponse> {
    const user = await this.usersRepository.findUserById(userId)

    if (!user) {
      return left(new NotFoundException('User not found'))
    }

    const contacts = await this.contactsRepository.fetchContacts(userId)

    if (!contacts.length) {
      return right({ contacts: [] })
    }

    const contactsMapped = contacts.map(contact => ({
      id: contact.id,
      name: contact.name,
      phone: contact.phone,
      email: contact.email,
      birthday: contact.birthday && formatCalendarDate(contact.birthday),
      category: contact.category,
      observations: contact.observations,
      createdAt: contact.createdAt,
      updatedAt: contact.updatedAt,
    }))

    return right({ contacts: contactsMapped })
  }
}
