import { randomUUID } from 'node:crypto'

import { faker } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'

import { PrismaService } from '@/database/prisma.service'
import {
  CONTACT_CATEGORIES,
  Contact,
} from '@/modules/contacts/domain/contacts.repository'
import { parseCalendarDate } from '@/utils/calendar-date'

export function makeContact(override: Partial<Contact> = {}): Contact {
  const now = new Date()

  return {
    id: randomUUID(),
    userId: randomUUID(),
    name: faker.person.fullName(),
    email: faker.internet.email(),
    phone: faker.phone.number(),
    birthday: parseCalendarDate(
      faker.date.birthdate().toISOString().slice(0, 10),
    ),
    category: faker.helpers.arrayElement(CONTACT_CATEGORIES),
    observations: faker.lorem.sentences(2),
    createdAt: now,
    updatedAt: now,
    ...override,
  }
}

@Injectable()
export class ContactFactory {
  constructor(private readonly prismaService: PrismaService) {}

  async makePrismaContact(
    userId: string,
    override: Partial<Contact> = {},
  ): Promise<Contact> {
    const contact = makeContact({ ...override, userId })

    await this.prismaService.contact.create({ data: contact })

    return contact
  }
}
