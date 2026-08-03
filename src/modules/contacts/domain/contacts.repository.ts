export const CONTACT_CATEGORIES = [
  'FAMILY',
  'FRIENDS',
  'WORK',
  'SCHOOL',
] as const

export type ContactCategory = (typeof CONTACT_CATEGORIES)[number]

export type Contact = {
  id: string
  userId: string
  name: string
  phone: string
  email: string | null
  birthday: Date | null
  category: ContactCategory | null
  observations: string | null
  createdAt: Date
  updatedAt: Date
}

export type ContactData = Omit<
  Contact,
  'id' | 'userId' | 'createdAt' | 'updatedAt'
>

export abstract class ContactsRepository {
  abstract createContact(userId: string, data: ContactData): Promise<Contact>
  abstract fetchContacts(userId: string): Promise<Contact[]>
  abstract findContactByIdAndUserId(
    id: string,
    userId: string,
  ): Promise<Contact | null>
  abstract updateContact(
    id: string,
    userId: string,
    data: ContactData,
  ): Promise<Contact>
  abstract deleteContact(id: string, userId: string): Promise<void>
}
