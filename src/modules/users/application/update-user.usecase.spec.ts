import { randomUUID } from 'node:crypto'

import { ConflictException, NotFoundException } from '@nestjs/common'

import { makeUser } from '@test/factories/user.factory'
import { UsersInMemoryRepository } from '@test/repositories/users-in-memory.repository'

import { UpdateUserUseCase } from './update-user.usecase'

let usersRepository: UsersInMemoryRepository
let sut: UpdateUserUseCase

const USER_ID = randomUUID()
const ANOTHER_USER_ID = randomUUID()

describe('UpdateUserUseCase', () => {
  beforeEach(() => {
    usersRepository = new UsersInMemoryRepository()
    sut = new UpdateUserUseCase(usersRepository)
  })

  it('should update user name', async () => {
    usersRepository.users.push(makeUser({ id: USER_ID }))

    const result = await sut.execute(USER_ID, { name: 'John Doe Jr.' })

    expect(result.isRight()).toBe(true)

    if (result.isLeft()) return

    expect(result.value.name).toBe('John Doe Jr.')
    expect(usersRepository.users[0].name).toBe('John Doe Jr.')
  })

  it('should update user e-mail', async () => {
    usersRepository.users.push(makeUser({ id: USER_ID }))

    const result = await sut.execute(USER_ID, {
      email: 'john.doe2@example.com',
    })

    expect(result.isRight()).toBe(true)

    if (result.isLeft()) return

    expect(result.value.email).toBe('john.doe2@example.com')
    expect(usersRepository.users[0].email).toBe('john.doe2@example.com')
  })

  it('should update user name and e-mail', async () => {
    usersRepository.users.push(makeUser({ id: USER_ID }))

    const result = await sut.execute(USER_ID, {
      name: 'John Doe Jr.',
      email: 'john.doe2@example.com',
    })

    expect(result.isRight()).toBe(true)

    if (result.isLeft()) return

    expect(result.value.name).toBe('John Doe Jr.')
    expect(result.value.email).toBe('john.doe2@example.com')
    expect(usersRepository.users[0].name).toBe('John Doe Jr.')
    expect(usersRepository.users[0].email).toBe('john.doe2@example.com')
  })

  it("should allow updating while keeping the user's own e-mail", async () => {
    const user = makeUser({ id: USER_ID })

    usersRepository.users.push(user)

    const result = await sut.execute(USER_ID, {
      name: 'John Doe Jr.',
      email: user.email,
    })

    expect(result.isRight()).toBe(true)

    if (result.isLeft()) return

    expect(result.value.name).toEqual('John Doe Jr.')
    expect(result.value.email).toEqual(user.email)
  })

  it('should not overwrite a key when an explicit undefined value is passed', async () => {
    const user = makeUser({ id: USER_ID })

    usersRepository.users.push(user)

    const result = await sut.execute(USER_ID, {
      name: 'John Doe Jr.',
      email: undefined,
    })

    expect(result.isRight()).toBe(true)

    if (result.isLeft()) return

    expect(result.value.name).toBe('John Doe Jr.')
    expect(result.value.email).toBe(user.email)
  })

  it('should return not found when the user does not exist', async () => {
    usersRepository.users.push(makeUser({ id: USER_ID }))

    const result = await sut.execute(ANOTHER_USER_ID, {
      name: 'Jane Doe',
      email: 'jane.doe@example.com',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotFoundException)
  })

  it('should not be able to update e-mail if this e-mail is already taken', async () => {
    usersRepository.users.push(
      makeUser({ id: USER_ID }),
      makeUser({ id: ANOTHER_USER_ID, email: 'john.doe@example.com' }),
    )

    const result = await sut.execute(USER_ID, {
      email: 'john.doe@example.com',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ConflictException)
  })
})
