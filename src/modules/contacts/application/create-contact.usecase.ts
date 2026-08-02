import { Injectable, NotFoundException } from '@nestjs/common'

import { UsersRepository } from '@/modules/users/domain/users.repository'
import { formatCalendarDate, parseCalendarDate } from '@/utils/calendar-date'
import { Either, left, right } from '@/utils/either'

import {
  ContactCategory,
  ContactsRepository,
} from '../domain/contacts.repository'

export type CreateContactInput = {
  name: string
  phone: string
  email?: string | null
  birthday?: string | null
  category?: ContactCategory | null
  observations?: string | null
}

type CreateContactOutput = {
  id: string
  name: string
  phone: string
  email?: string
  birthday?: string
  category?: ContactCategory
  observations?: string
  createdAt: Date
  updatedAt: Date
}

type CreateContactUseCaseResponse = Either<
  NotFoundException,
  CreateContactOutput
>

@Injectable()
export class CreateContactUseCase {
  constructor(
    private readonly contactsRepository: ContactsRepository,
    private readonly usersRepository: UsersRepository,
  ) {}

  async execute(
    userId: string,
    data: CreateContactInput,
  ): Promise<CreateContactUseCaseResponse> {
    const user = await this.usersRepository.findUserById(userId)

    if (!user) {
      return left(new NotFoundException('User not found.'))
    }

    const contact = await this.contactsRepository.createContact(userId, {
      name: data.name,
      phone: data.phone,
      email: data.email ?? null,
      birthday: data.birthday ? parseCalendarDate(data.birthday) : null,
      category: data.category ?? null,
      observations: data.observations ?? null,
    })

    return right({
      id: contact.id,
      name: contact.name,
      phone: contact.phone,
      email: contact.email ?? undefined,
      birthday: contact.birthday
        ? formatCalendarDate(contact.birthday)
        : undefined,
      category: contact.category ?? undefined,
      observations: contact.observations ?? undefined,
      createdAt: contact.createdAt,
      updatedAt: contact.updatedAt,
    })
  }
}
