import { Injectable, NotFoundException } from '@nestjs/common'

import { UsersRepository } from '@/modules/users/domain/users.repository'
import { parseCalendarDate } from '@/utils/calendar-date'
import { Either, left, right } from '@/utils/either'

import { ContactOutput, toContactOutput } from './contact-output'
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

type CreateContactUseCaseResponse = Either<NotFoundException, ContactOutput>

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
      return left(new NotFoundException('User not found'))
    }

    const contact = await this.contactsRepository.createContact(userId, {
      name: data.name,
      phone: data.phone,
      email: data.email ?? null,
      birthday: data.birthday ? parseCalendarDate(data.birthday) : null,
      category: data.category ?? null,
      observations: data.observations ?? null,
    })

    return right(toContactOutput(contact))
  }
}
