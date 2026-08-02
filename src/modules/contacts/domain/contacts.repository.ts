import { MakeOptional } from '@/types/types'

export type Category = 'FAMILY' | 'FRIENDS' | 'WORK' | 'SCHOOL'

export type Contact = {
  id: string
  userId: string
  name: string
  phone: string
  email: string | null
  birthday: Date | null
  category: Category | null
  observations: string | null
  createdAt: Date
  updatedAt: Date
}

export type CreateOrUpdateContact = MakeOptional<
  Omit<Contact, 'id' | 'userId' | 'createdAt' | 'updatedAt'>,
  'email' | 'birthday' | 'category' | 'observations'
>

export abstract class ContactsRepository {
  abstract findContactByIdAndUserId(
    id: string,
    userId: string,
  ): Promise<Contact | null>
  abstract fetchContacts(userId: string): Promise<Contact[]>
  abstract createContact(
    userId: string,
    data: CreateOrUpdateContact,
  ): Promise<Contact>
  abstract updateContact(
    id: string,
    userId: string,
    data: CreateOrUpdateContact,
  ): Promise<Contact>
  abstract deleteContact(id: string, userId: string): Promise<void>
}
