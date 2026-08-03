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
      this.contacts
        .filter(contact => contact.userId === userId)
        .sort((a, b) => a.name.localeCompare(b.name)),
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
    const contactIndex = this.contacts.findIndex(
      contact => contact.id === id && contact.userId === userId,
    )

    if (contactIndex === -1) {
      throw new Error('Contact not found')
    }

    const definedData = Object.fromEntries(
      Object.entries(data).filter(([, value]) => value !== undefined),
    )

    const updatedContact = {
      ...this.contacts[contactIndex],
      ...definedData,
      updatedAt: new Date(),
    }

    this.contacts[contactIndex] = updatedContact

    return Promise.resolve(updatedContact)
  }

  deleteContact(id: string, userId: string): Promise<void> {
    const contactIndex = this.contacts.findIndex(
      contact => contact.id === id && contact.userId === userId,
    )

    if (contactIndex === -1) {
      throw new Error('Contact not found')
    }

    this.contacts.splice(contactIndex, 1)

    return Promise.resolve()
  }
}
