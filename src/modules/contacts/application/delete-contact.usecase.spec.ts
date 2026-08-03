import { randomUUID } from 'node:crypto'

import { NotFoundException } from '@nestjs/common'

import { makeContact } from '@test/factories/contact.factory'
import { ContactsInMemoryRepository } from '@test/repositories/contacts-in-memory.repository'

import { DeleteContactUseCase } from './delete-contact.usecase'

let contactsRepository: ContactsInMemoryRepository
let sut: DeleteContactUseCase

const CONTACT_ID = randomUUID()
const USER_ID = randomUUID()
const ANOTHER_USER_ID = randomUUID()

describe('DeleteContactUseCase', () => {
  beforeEach(() => {
    contactsRepository = new ContactsInMemoryRepository()
    sut = new DeleteContactUseCase(contactsRepository)
  })

  it('should delete the contact', async () => {
    contactsRepository.contacts.push(
      makeContact({ id: CONTACT_ID, userId: USER_ID }),
    )

    const result = await sut.execute(CONTACT_ID, USER_ID)

    expect(result.isRight()).toBe(true)
    expect(contactsRepository.contacts).toHaveLength(0)
  })

  it("should only delete the caller's own contact", async () => {
    contactsRepository.contacts.push(
      makeContact({ id: CONTACT_ID, userId: USER_ID }),
      makeContact({ userId: USER_ID }),
    )

    await sut.execute(CONTACT_ID, USER_ID)

    expect(contactsRepository.contacts).toHaveLength(1)
    expect(contactsRepository.contacts[0].id).not.toBe(CONTACT_ID)
  })

  it("should not delete another user's contact", async () => {
    contactsRepository.contacts.push(
      makeContact({ id: CONTACT_ID, userId: ANOTHER_USER_ID }),
    )

    const result = await sut.execute(CONTACT_ID, USER_ID)

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotFoundException)
    expect(contactsRepository.contacts).toHaveLength(1)
  })

  it('should return not found when the contact does not exist', async () => {
    const result = await sut.execute(CONTACT_ID, USER_ID)

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotFoundException)
  })
})
