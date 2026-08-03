import { randomUUID } from 'node:crypto'

import { NotFoundException } from '@nestjs/common'

import { makeContact } from '@test/factories/contact.factory'
import { makeUser } from '@test/factories/user.factory'
import { ContactsInMemoryRepository } from '@test/repositories/contacts-in-memory.repository'
import { UsersInMemoryRepository } from '@test/repositories/users-in-memory.repository'

import { FetchContactsUseCase } from './fetch-contacts.usecase'

let contactsRepository: ContactsInMemoryRepository
let usersRepository: UsersInMemoryRepository
let sut: FetchContactsUseCase

const USER_ID = randomUUID()
const USER_ID2 = randomUUID()

describe('FetchContactsUseCase', () => {
  beforeEach(() => {
    usersRepository = new UsersInMemoryRepository()
    contactsRepository = new ContactsInMemoryRepository()
    sut = new FetchContactsUseCase(contactsRepository, usersRepository)

    usersRepository.users.push(makeUser({ id: USER_ID }))
    usersRepository.users.push(makeUser({ id: USER_ID2 }))
  })

  it('should get all contacts', async () => {
    contactsRepository.contacts.push(
      makeContact({ userId: USER_ID }),
      makeContact({ userId: USER_ID }),
    )

    const result = await sut.execute(USER_ID)

    expect(result.isRight()).toBe(true)

    if (result.isLeft()) return

    expect(contactsRepository.contacts[0].name).toEqual(
      result.value.contacts[0].name,
    )
    expect(contactsRepository.contacts[0].phone).toEqual(
      result.value.contacts[0].phone,
    )
    expect(contactsRepository.contacts[1].name).toEqual(
      result.value.contacts[1].name,
    )
    expect(contactsRepository.contacts[1].phone).toEqual(
      result.value.contacts[1].phone,
    )
  })

  it('should return an empty array when no contact is found', async () => {
    const result = await sut.execute(USER_ID)

    expect(result.isRight()).toBe(true)

    if (result.isLeft()) return

    expect(result.value).toEqual({ contacts: [] })
  })

  it("should not fetch another user's contacts", async () => {
    contactsRepository.contacts.push(
      makeContact({ userId: USER_ID }),
      makeContact({ userId: USER_ID2 }),
    )

    const result = await sut.execute(USER_ID)

    expect(result.isRight()).toBe(true)

    if (result.isLeft()) return

    expect(result.value.contacts.length).toBe(1)
  })

  it('should return not found when the user does not exist', async () => {
    usersRepository.users = []

    const result = await sut.execute(USER_ID)

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotFoundException)
  })
})
