import { randomUUID } from 'node:crypto'

import { ConflictException, NotFoundException } from '@nestjs/common'

import { UpdateUserUseCase } from './update-user.usecase'
import { UsersInMemoryRepository } from '../infra/users-in-memory.repository'

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
    usersRepository.users.push({
      id: USER_ID,
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: 'any-hash',
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    const result = await sut.execute(USER_ID, { name: 'John Doe Jr.' })

    expect(result.isRight()).toBe(true)

    if (result.isLeft()) return

    expect(usersRepository.users[0].name).toEqual(result.value.name)
  })

  it('should update user e-mail', async () => {
    usersRepository.users.push({
      id: USER_ID,
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: 'any-hash',
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    const result = await sut.execute(USER_ID, { email: 'johndoe2@example.com' })

    expect(result.isRight()).toBe(true)

    if (result.isLeft()) return

    expect(usersRepository.users[0].email).toEqual(result.value.email)
  })

  it('should update user name and e-mail', async () => {
    usersRepository.users.push({
      id: USER_ID,
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: 'any-hash',
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    const result = await sut.execute(USER_ID, {
      name: 'John Doe Jr.',
      email: 'johndoe2@example.com',
    })

    expect(result.isRight()).toBe(true)

    if (result.isLeft()) return

    expect(usersRepository.users[0].name).toEqual(result.value.name)
    expect(usersRepository.users[0].email).toEqual(result.value.email)
  })

  it("should allow updating while keeping the user's own e-mail", async () => {
    usersRepository.users.push({
      id: USER_ID,
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: 'any-hash',
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    const result = await sut.execute(USER_ID, {
      name: 'John Doe',
      email: 'johndoe@example.com',
    })

    expect(result.isRight()).toBe(true)

    if (result.isLeft()) return

    expect(usersRepository.users[0].name).toEqual(result.value.name)
    expect(usersRepository.users[0].email).toEqual(result.value.email)
  })

  it('should not overwrite a key when an explicit undefined value is passed', async () => {
    usersRepository.users.push({
      id: USER_ID,
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: 'any-hash',
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    const result = await sut.execute(USER_ID, {
      name: 'John Doe Jr.',
      email: undefined,
    })

    expect(result.isRight()).toBe(true)

    if (result.isLeft()) return

    expect(result.value.email).not.toBeUndefined()
  })

  it('should return not found when the user not exist', async () => {
    usersRepository.users.push({
      id: USER_ID,
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: 'any-hash',
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    const result = await sut.execute(ANOTHER_USER_ID, {
      name: 'Jane Doe',
      email: 'janedoe@example.com',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotFoundException)
  })

  it('should not be able to update e-mail if this e-mail is already taken', async () => {
    usersRepository.users.push(
      {
        id: USER_ID,
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: 'any-hash',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: ANOTHER_USER_ID,
        name: 'Jane Doe',
        email: 'janedoe@example.com',
        password: 'any-hash',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    )

    const result = await sut.execute(USER_ID, {
      email: 'janedoe@example.com',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ConflictException)
  })
})
