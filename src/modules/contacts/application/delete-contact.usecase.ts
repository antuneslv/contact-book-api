import { Injectable, NotFoundException } from '@nestjs/common'

import { Either, left, right } from '@/utils/either'

import { ContactsRepository } from '../domain/contacts.repository'

type DeleteContactUseCaseResponse = Either<NotFoundException, null>

@Injectable()
export class DeleteContactUseCase {
  constructor(private readonly contactsRepository: ContactsRepository) {}

  async execute(
    id: string,
    userId: string,
  ): Promise<DeleteContactUseCaseResponse> {
    const contact = await this.contactsRepository.findContactByIdAndUserId(
      id,
      userId,
    )

    if (!contact) {
      return left(new NotFoundException('Contact not found'))
    }

    await this.contactsRepository.deleteContact(id, userId)

    return right(null)
  }
}
