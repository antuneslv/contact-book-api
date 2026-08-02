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

const USER_ID = 'user-id'

const CREATE_CONTACT_REQUEST: CreateContactInput = {
  name: 'John Doe',
  phone: '1234567890',
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

    expect(contactsRepository.contacts[0].id).toEqual(result.value.id)
    expect(contactsRepository.contacts[0].name).toEqual(result.value.name)
    expect(contactsRepository.contacts[0].phone).toEqual(result.value.phone)
  })

  it('should return not found when the user does not exist', async () => {
    usersRepository.users = []

    const result = await sut.execute(USER_ID, CREATE_CONTACT_REQUEST)

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotFoundException)
  })
})
