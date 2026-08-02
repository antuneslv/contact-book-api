/* eslint-disable @typescript-eslint/no-unused-vars */
import { randomUUID } from 'node:crypto'

import {
  Contact,
  ContactsRepository,
  CreateOrUpdateContact,
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

  createContact(userId: string, data: CreateOrUpdateContact): Promise<Contact> {
    const date = new Date()

    const contact: Contact = {
      id: randomUUID(),
      userId,
      name: data.name,
      phone: data.phone,
      email: data.email ?? null,
      birthday: data.birthday ?? null,
      category: data.category ?? null,
      observations: data.observations ?? null,
      createdAt: date,
      updatedAt: date,
    }

    this.contacts.push(contact)

    return Promise.resolve(contact)
  }

  updateContact(
    id: string,
    userId: string,
    data: CreateOrUpdateContact,
  ): Promise<Contact> {
    throw new Error('Method not implemented.')
  }

  deleteContact(id: string, userId: string): Promise<void> {
    throw new Error('Method not implemented.')
  }
}
