import { Injectable } from '@nestjs/common'

import { ContactOutput, toContactOutput } from './contact-output'
import { ContactsRepository } from '../domain/contacts.repository'

type FetchContactsOutput = {
  contacts: ContactOutput[]
}

@Injectable()
export class FetchContactsUseCase {
  constructor(private readonly contactsRepository: ContactsRepository) {}

  async execute(userId: string): Promise<FetchContactsOutput> {
    const contacts = await this.contactsRepository.fetchContacts(userId)

    return { contacts: contacts.map(toContactOutput) }
  }
}
