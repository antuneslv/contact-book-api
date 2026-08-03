import { randomUUID } from 'node:crypto'

import { makeContact } from '@test/factories/contact.factory'
import { ContactsInMemoryRepository } from '@test/repositories/contacts-in-memory.repository'

import { FetchContactsUseCase } from './fetch-contacts.usecase'

let contactsRepository: ContactsInMemoryRepository
let sut: FetchContactsUseCase

const USER_ID = randomUUID()
const ANOTHER_USER_ID = randomUUID()

describe('FetchContactsUseCase', () => {
  beforeEach(() => {
    contactsRepository = new ContactsInMemoryRepository()
    sut = new FetchContactsUseCase(contactsRepository)
  })

  it('should fetch the contacts ordered by name', async () => {
    contactsRepository.contacts.push(
      makeContact({ userId: USER_ID, name: 'Zeca' }),
      makeContact({ userId: USER_ID, name: 'Ana' }),
      makeContact({ userId: USER_ID, name: 'Mario' }),
    )

    const { contacts } = await sut.execute(USER_ID)

    expect(contacts.map(contact => contact.name)).toEqual([
      'Ana',
      'Mario',
      'Zeca',
    ])
  })

  it('should return an empty array when no contact is found', async () => {
    const result = await sut.execute(USER_ID)

    expect(result).toEqual({ contacts: [] })
  })

  it("should not fetch another user's contacts", async () => {
    contactsRepository.contacts.push(
      makeContact({ userId: USER_ID, name: 'Mine' }),
      makeContact({ userId: ANOTHER_USER_ID, name: 'Theirs' }),
    )

    const { contacts } = await sut.execute(USER_ID)

    expect(contacts.map(contact => contact.name)).toEqual(['Mine'])
  })

  it('should expose the birthday as a calendar date', async () => {
    const contact = makeContact({ userId: USER_ID })

    contactsRepository.contacts.push(contact)

    const { contacts } = await sut.execute(USER_ID)

    expect(contacts[0].birthday).toBe(
      contact.birthday?.toISOString().slice(0, 10),
    )
  })
})
