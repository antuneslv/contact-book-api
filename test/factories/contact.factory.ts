import { randomUUID } from 'node:crypto'

import { faker } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'

import { PrismaService } from '@/database/prisma.service'
import { Contact } from '@/modules/contacts/domain/contacts.repository'

export function makeContact(override: Partial<Contact> = {}): Contact {
  const now = new Date()

  return {
    id: randomUUID(),
    userId: randomUUID(),
    name: faker.person.fullName(),
    email: faker.internet.email(),
    phone: faker.phone.number(),
    birthday: faker.date.birthdate(),
    category: faker.helpers.arrayElement([
      'FAMILY',
      'FRIENDS',
      'WORK',
      'SCHOOL',
    ]),
    observations: faker.lorem.sentences(2),
    createdAt: now,
    updatedAt: now,
    ...override,
  }
}

@Injectable()
export class ContactFactory {
  constructor(private readonly prismaService: PrismaService) {}

  async makePrismaContact(override: Partial<Contact> = {}) {
    const contact = makeContact(override)

    await this.prismaService.contact.create({ data: contact })

    return { contact }
  }
}
