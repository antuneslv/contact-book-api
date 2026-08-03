import { randomUUID } from 'node:crypto'

import { NotFoundException } from '@nestjs/common'

import { makeContact } from '@test/factories/contact.factory'
import { makeUser } from '@test/factories/user.factory'
import { ContactsInMemoryRepository } from '@test/repositories/contacts-in-memory.repository'
import { UsersInMemoryRepository } from '@test/repositories/users-in-memory.repository'

import { GetContactUseCase } from './get-contact.usecase'

let contactsRepository: ContactsInMemoryRepository
let usersRepository: UsersInMemoryRepository
let sut: GetContactUseCase

const CONTACT_ID = randomUUID()
const USER_ID = randomUUID()

describe('GetContactUseCase', () => {
  beforeEach(() => {
    usersRepository = new UsersInMemoryRepository()
    contactsRepository = new ContactsInMemoryRepository()
    sut = new GetContactUseCase(contactsRepository)

    usersRepository.users.push(makeUser({ id: USER_ID }))
  })

  it('should get an existing contact', async () => {
    contactsRepository.contacts.push(
      makeContact({ id: CONTACT_ID, userId: USER_ID }),
    )

    const result = await sut.execute(CONTACT_ID, USER_ID)

    expect(result.isRight()).toBe(true)

    if (result.isLeft()) return

    expect(contactsRepository.contacts[0].name).toEqual(result.value.name)
    expect(contactsRepository.contacts[0].phone).toEqual(result.value.phone)
  })

  it('should return a not found exception error when it fails to find a contact', async () => {
    const result = await sut.execute(CONTACT_ID, USER_ID)

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotFoundException)
  })
})
