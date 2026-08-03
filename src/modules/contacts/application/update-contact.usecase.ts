import { Injectable, NotFoundException } from '@nestjs/common'

import { parseCalendarDate } from '@/utils/calendar-date'
import { Either, left, right } from '@/utils/either'

import { ContactOutput, toContactOutput } from './contact-output'
import {
  ContactCategory,
  ContactsRepository,
} from '../domain/contacts.repository'

export type UpdateContactInput = {
  name: string
  phone: string
  email: string | null
  birthday: string | null
  category: ContactCategory | null
  observations: string | null
}

type UpdateContactUseCaseResponse = Either<NotFoundException, ContactOutput>

@Injectable()
export class UpdateContactUseCase {
  constructor(private readonly contactsRepository: ContactsRepository) {}

  async execute(
    id: string,
    userId: string,
    data: UpdateContactInput,
  ): Promise<UpdateContactUseCaseResponse> {
    const contact = await this.contactsRepository.findContactByIdAndUserId(
      id,
      userId,
    )

    if (!contact) {
      return left(new NotFoundException('Contact not found'))
    }

    const updatedContact = await this.contactsRepository.updateContact(
      id,
      userId,
      {
        name: data.name,
        phone: data.phone,
        email: data.email,
        birthday: data.birthday ? parseCalendarDate(data.birthday) : null,
        category: data.category,
        observations: data.observations,
      },
    )

    return right(toContactOutput(updatedContact))
  }
}
