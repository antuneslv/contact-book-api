import { Injectable, NotFoundException } from '@nestjs/common'

import { formatCalendarDate } from '@/utils/calendar-date'
import { Either, left, right } from '@/utils/either'

import {
  ContactCategory,
  ContactsRepository,
} from '../domain/contacts.repository'

type GetContactOutput = {
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

type GetContactUseCaseResponse = Either<NotFoundException, GetContactOutput>

@Injectable()
export class GetContactUseCase {
  constructor(private readonly contactsRepository: ContactsRepository) {}

  async execute(
    id: string,
    userId: string,
  ): Promise<GetContactUseCaseResponse> {
    const contact = await this.contactsRepository.findContactByIdAndUserId(
      id,
      userId,
    )

    if (!contact) {
      return left(new NotFoundException('Contact not found'))
    }

    return right({
      id: contact.id,
      name: contact.name,
      phone: contact.phone,
      email: contact.email,
      birthday: contact.birthday && formatCalendarDate(contact.birthday),
      category: contact.category,
      observations: contact.observations,
      createdAt: contact.createdAt,
      updatedAt: contact.updatedAt,
    })
  }
}
