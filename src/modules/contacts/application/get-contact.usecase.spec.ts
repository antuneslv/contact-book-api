import { randomUUID } from 'node:crypto'

import { NotFoundException } from '@nestjs/common'

import { makeContact } from '@test/factories/contact.factory'
import { ContactsInMemoryRepository } from '@test/repositories/contacts-in-memory.repository'

import { GetContactUseCase } from './get-contact.usecase'

let contactsRepository: ContactsInMemoryRepository
let sut: GetContactUseCase

const CONTACT_ID = randomUUID()
const USER_ID = randomUUID()
const ANOTHER_USER_ID = randomUUID()

describe('GetContactUseCase', () => {
  beforeEach(() => {
    contactsRepository = new ContactsInMemoryRepository()
    sut = new GetContactUseCase(contactsRepository)
  })

  it('should get an existing contact', async () => {
    const contact = makeContact({ id: CONTACT_ID, userId: USER_ID })

    contactsRepository.contacts.push(contact)

    const result = await sut.execute(CONTACT_ID, USER_ID)

    expect(result.isRight()).toBe(true)

    if (result.isLeft()) return

    expect(result.value).toEqual({
      id: contact.id,
      name: contact.name,
      phone: contact.phone,
      email: contact.email,
      birthday: contact.birthday?.toISOString().slice(0, 10) ?? null,
      category: contact.category,
      observations: contact.observations,
      createdAt: contact.createdAt,
      updatedAt: contact.updatedAt,
    })
  })

  it("should not get another user's contact", async () => {
    contactsRepository.contacts.push(
      makeContact({ id: CONTACT_ID, userId: ANOTHER_USER_ID }),
    )

    const result = await sut.execute(CONTACT_ID, USER_ID)

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotFoundException)
  })

  it('should return a not found exception error when it fails to find a contact', async () => {
    const result = await sut.execute(CONTACT_ID, USER_ID)

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotFoundException)
  })
})
