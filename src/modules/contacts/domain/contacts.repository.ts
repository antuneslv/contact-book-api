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

/**
 * Full state of a contact, as accepted by create and by `PUT`.
 *
 * @remarks
 * Every field is required — nullable ones must be passed as `null` rather than
 * omitted. Prisma ignores `undefined` keys, so an omitted field would keep its
 * previous value and a `PUT` would silently behave like a `PATCH`.
 **/
export type ContactData = Omit<
  Contact,
  'id' | 'userId' | 'createdAt' | 'updatedAt'
>

export abstract class ContactsRepository {
  abstract findContactByIdAndUserId(
    id: string,
    userId: string,
  ): Promise<Contact | null>
  abstract fetchContacts(userId: string): Promise<Contact[]>
  abstract createContact(userId: string, data: ContactData): Promise<Contact>
  abstract updateContact(
    id: string,
    userId: string,
    data: ContactData,
  ): Promise<Contact>
  abstract deleteContact(id: string, userId: string): Promise<void>
}
