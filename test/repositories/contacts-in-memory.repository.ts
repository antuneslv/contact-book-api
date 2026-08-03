/* eslint-disable @typescript-eslint/no-unused-vars */
import { randomUUID } from 'node:crypto'

import {
  Contact,
  ContactData,
  ContactsRepository,
} from '@/modules/contacts/domain/contacts.repository'

export class ContactsInMemoryRepository implements ContactsRepository {
  contacts: Contact[] = []

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

  fetchContacts(userId: string): Promise<Contact[]> {
    return Promise.resolve(
      this.contacts.filter(contact => contact.userId === userId),
    )
  }

  findContactByIdAndUserId(
    id: string,
    userId: string,
  ): Promise<Contact | null> {
    return Promise.resolve(
      this.contacts.find(
        contact => contact.id === id && contact.userId === userId,
      ) ?? null,
    )
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
