import { randomUUID } from 'node:crypto'

import { NotFoundException } from '@nestjs/common'

import { makeUser } from '@test/factories/user.factory'
import { ContactsInMemoryRepository } from '@test/repositories/contacts-in-memory.repository'
import { UsersInMemoryRepository } from '@test/repositories/users-in-memory.repository'

import {
  CreateContactInput,
  CreateContactUseCase,
} from './create-contact.usecase'

let contactsRepository: ContactsInMemoryRepository
let usersRepository: UsersInMemoryRepository
let sut: CreateContactUseCase

const USER_ID = randomUUID()

const CREATE_CONTACT_REQUEST: CreateContactInput = {
  name: 'John Doe',
  phone: '+1 555 000 0000',
  email: 'john.doe@example.com',
  birthday: '1990-01-20',
  category: 'FRIENDS',
  observations: 'Some observations about John Doe',
}

describe('CreateContactUseCase', () => {
  beforeEach(() => {
    usersRepository = new UsersInMemoryRepository()
    contactsRepository = new ContactsInMemoryRepository()
    sut = new CreateContactUseCase(contactsRepository, usersRepository)

    usersRepository.users.push(makeUser({ id: USER_ID }))
  })

  it('should create a new contact', async () => {
    const result = await sut.execute(USER_ID, CREATE_CONTACT_REQUEST)

    expect(result.isRight()).toBe(true)

    if (result.isLeft()) return

    expect(result.value).toMatchObject({
      name: 'John Doe',
      phone: '+1 555 000 0000',
      email: 'john.doe@example.com',
      category: 'FRIENDS',
      observations: 'Some observations about John Doe',
    })

    expect(contactsRepository.contacts).toHaveLength(1)
    expect(contactsRepository.contacts[0]).toMatchObject({
      id: result.value.id,
      userId: USER_ID,
      name: 'John Doe',
      phone: '+1 555 000 0000',
    })
  })

  it('should keep the birthday on the same calendar day it was sent', async () => {
    const result = await sut.execute(USER_ID, CREATE_CONTACT_REQUEST)

    expect(result.isRight()).toBe(true)

    if (result.isLeft()) return

    expect(result.value.birthday).toBe('1990-01-20')
    expect(contactsRepository.contacts[0].birthday?.toISOString()).toBe(
      '1990-01-20T00:00:00.000Z',
    )
  })

  it('should store omitted optional fields as null', async () => {
    const result = await sut.execute(USER_ID, {
      name: 'Jane Doe',
      phone: '+1 555 111 1111',
    })

    expect(result.isRight()).toBe(true)

    if (result.isLeft()) return

    expect(contactsRepository.contacts[0]).toMatchObject({
      email: null,
      birthday: null,
      category: null,
      observations: null,
    })

    expect(result.value.email).toBeNull()
    expect(result.value.birthday).toBeNull()
    expect(result.value.category).toBeNull()
    expect(result.value.observations).toBeNull()
  })

  it('should return not found when the user does not exist', async () => {
    usersRepository.users = []

    const result = await sut.execute(USER_ID, CREATE_CONTACT_REQUEST)

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotFoundException)
  })
})
