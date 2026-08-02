import { randomUUID } from 'node:crypto'

import { faker } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'

import { HashService } from '@/crypto/hash.service'
import { PrismaService } from '@/database/prisma.service'
import { User } from '@/modules/users/domain/users.repository'

export function makeUser(override: Partial<User> = {}): User {
  const now = new Date()

  return {
    id: randomUUID(),
    name: faker.person.fullName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    createdAt: now,
    updatedAt: now,
    ...override,
  }
}

@Injectable()
export class UserFactory {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly hashService: HashService,
  ) {}

  async makePrismaUser(override: Partial<User> = {}) {
    const password = override.password ?? faker.internet.password()

    const user = makeUser({
      ...override,
      password: await this.hashService.hash(password),
    })

    await this.prismaService.user.create({ data: user })

    return { user, password }
  }
}
