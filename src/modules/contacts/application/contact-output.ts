import { formatCalendarDate } from '@/utils/calendar-date'

import { Contact, ContactCategory } from '../domain/contacts.repository'

/**
 * Shape every contact use case returns.
 *
 * @remarks
 * Differs from the domain `Contact` in two ways: `userId` is dropped — the
 * caller already knows whose contact it is — and `birthday` becomes a
 * `YYYY-MM-DD` string, since a calendar date has no time to expose.
 **/
export type ContactOutput = {
  id: string
  name: string
  phone: string
  email: string | null
  birthday: string | null
  category: ContactCategory | null
  observations: string | null
  createdAt: Date
  updatedAt: Date
}

/**
 * Converts a domain contact into the use case output.
 *
 * @remarks
 * Shared by every contact use case on purpose. With a copy per use case, adding
 * a field to `Contact` means remembering to touch each one — and since each had
 * its own output type, the compiler stayed silent about the ones left behind.
 **/
export function toContactOutput(contact: Contact): ContactOutput {
  return {
    id: contact.id,
    name: contact.name,
    phone: contact.phone,
    email: contact.email,
    birthday: contact.birthday && formatCalendarDate(contact.birthday),
    category: contact.category,
    observations: contact.observations,
    createdAt: contact.createdAt,
    updatedAt: contact.updatedAt,
  }
}
