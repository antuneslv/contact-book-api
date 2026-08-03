import { randomUUID } from 'node:crypto'

import { NotFoundException } from '@nestjs/common'

import { makeContact } from '@test/factories/contact.factory'
import { ContactsInMemoryRepository } from '@test/repositories/contacts-in-memory.repository'

import {
  UpdateContactInput,
  UpdateContactUseCase,
} from './update-contact.usecase'

let contactsRepository: ContactsInMemoryRepository
let sut: UpdateContactUseCase

const CONTACT_ID = randomUUID()
const USER_ID = randomUUID()
const ANOTHER_USER_ID = randomUUID()

const UPDATE_CONTACT_REQUEST: UpdateContactInput = {
  name: 'John Doe Jr.',
  phone: '+1 555 111 1111',
  email: 'john.doe.jr@example.com',
  birthday: '1990-01-20',
  category: 'WORK',
  observations: 'Updated observations',
}

describe('UpdateContactUseCase', () => {
  beforeEach(() => {
    contactsRepository = new ContactsInMemoryRepository()
    sut = new UpdateContactUseCase(contactsRepository)
  })

  it('should replace every field of the contact', async () => {
    contactsRepository.contacts.push(
      makeContact({ id: CONTACT_ID, userId: USER_ID }),
    )

    const result = await sut.execute(
      CONTACT_ID,
      USER_ID,
      UPDATE_CONTACT_REQUEST,
    )

    expect(result.isRight()).toBe(true)

    if (result.isLeft()) return

    expect(result.value).toMatchObject({
      id: CONTACT_ID,
      name: 'John Doe Jr.',
      phone: '+1 555 111 1111',
      email: 'john.doe.jr@example.com',
      birthday: '1990-01-20',
      category: 'WORK',
      observations: 'Updated observations',
    })

    expect(contactsRepository.contacts[0]).toMatchObject({
      name: 'John Doe Jr.',
      phone: '+1 555 111 1111',
      email: 'john.doe.jr@example.com',
      category: 'WORK',
      observations: 'Updated observations',
    })
  })

  it('should clear the nullable fields when they are sent as null', async () => {
    contactsRepository.contacts.push(
      makeContact({ id: CONTACT_ID, userId: USER_ID }),
    )

    const result = await sut.execute(CONTACT_ID, USER_ID, {
      ...UPDATE_CONTACT_REQUEST,
      email: null,
      birthday: null,
      category: null,
      observations: null,
    })

    expect(result.isRight()).toBe(true)

    if (result.isLeft()) return

    expect(result.value).toMatchObject({
      email: null,
      birthday: null,
      category: null,
      observations: null,
    })

    expect(contactsRepository.contacts[0]).toMatchObject({
      email: null,
      birthday: null,
      category: null,
      observations: null,
    })
  })

  it('should keep the birthday on the same calendar day it was sent', async () => {
    contactsRepository.contacts.push(
      makeContact({ id: CONTACT_ID, userId: USER_ID }),
    )

    const result = await sut.execute(
      CONTACT_ID,
      USER_ID,
      UPDATE_CONTACT_REQUEST,
    )

    expect(result.isRight()).toBe(true)

    if (result.isLeft()) return

    expect(result.value.birthday).toBe('1990-01-20')
    expect(contactsRepository.contacts[0].birthday?.toISOString()).toBe(
      '1990-01-20T00:00:00.000Z',
    )
  })

  it('should bump updatedAt while preserving createdAt and ownership', async () => {
    const contact = makeContact({ id: CONTACT_ID, userId: USER_ID })

    contactsRepository.contacts.push(contact)

    await sut.execute(CONTACT_ID, USER_ID, UPDATE_CONTACT_REQUEST)

    const stored = contactsRepository.contacts[0]

    expect(stored.createdAt).toEqual(contact.createdAt)
    expect(stored.userId).toBe(USER_ID)
    expect(stored.updatedAt.getTime()).toBeGreaterThanOrEqual(
      contact.updatedAt.getTime(),
    )
  })

  it("should not update another user's contact", async () => {
    const contact = makeContact({ id: CONTACT_ID, userId: ANOTHER_USER_ID })

    contactsRepository.contacts.push(contact)

    const result = await sut.execute(
      CONTACT_ID,
      USER_ID,
      UPDATE_CONTACT_REQUEST,
    )

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotFoundException)
    expect(contactsRepository.contacts[0].name).toBe(contact.name)
  })

  it('should return not found when the contact does not exist', async () => {
    const result = await sut.execute(
      CONTACT_ID,
      USER_ID,
      UPDATE_CONTACT_REQUEST,
    )

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotFoundException)
  })
})
