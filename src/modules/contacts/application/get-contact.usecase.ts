import { Injectable, NotFoundException } from '@nestjs/common'

import { Either, left, right } from '@/utils/either'

import { ContactOutput, toContactOutput } from './contact-output'
import { ContactsRepository } from '../domain/contacts.repository'

type GetContactUseCaseResponse = Either<NotFoundException, ContactOutput>

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

    return right(toContactOutput(contact))
  }
}
