/* eslint-disable @typescript-eslint/no-unused-vars */
import { randomUUID } from 'node:crypto'

import {
  Contact,
  ContactData,
  ContactsRepository,
} from '@/modules/contacts/domain/contacts.repository'

export class ContactsInMemoryRepository implements ContactsRepository {
  contacts: Contact[] = []

  findContactByIdAndUserId(
    id: string,
    userId: string,
  ): Promise<Contact | null> {
    throw new Error('Method not implemented.')
  }

  fetchContacts(userId: string): Promise<Contact[]> {
    throw new Error('Method not implemented.')
  }

  createContact(userId: string, data: ContactData): Promise<Contact> {
    const date = new Date()

    const contact: Contact = {
      id: randomUUID(),
      userId,
      ...data,
      createdAt: date,
      updatedAt: date,
    }

    this.contacts.push(contact)

    return Promise.resolve(contact)
  }

  updateContact(
    id: string,
    userId: string,
    data: ContactData,
  ): Promise<Contact> {
    throw new Error('Method not implemented.')
  }

  deleteContact(id: string, userId: string): Promise<void> {
    throw new Error('Method not implemented.')
  }
}
