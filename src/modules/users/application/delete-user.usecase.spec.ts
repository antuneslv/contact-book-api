import { randomUUID } from 'node:crypto'

import { NotFoundException } from '@nestjs/common'

import { UsersInMemoryRepository } from '@test/repositories/users-in-memory.repository'

import { DeleteUserUseCase } from './delete-user.usecase'

let usersRepository: UsersInMemoryRepository
let sut: DeleteUserUseCase

const USER_ID = randomUUID()
const ANOTHER_USER_ID = randomUUID()

describe('DeleteUserUseCase', () => {
  beforeEach(() => {
    usersRepository = new UsersInMemoryRepository()
    sut = new DeleteUserUseCase(usersRepository)
  })

  it('should delete user account', async () => {
    usersRepository.users.push({
      id: USER_ID,
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: 'any-hash',
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    const result = await sut.execute(USER_ID)

    expect(result.isRight()).toBe(true)

    if (result.isLeft()) return

    expect(result.value).toBeNull()
  })

  it('should return not found when the user does not exist', async () => {
    usersRepository.users.push({
      id: USER_ID,
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: 'any-hash',
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    const result = await sut.execute(ANOTHER_USER_ID)

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotFoundException)
  })
})
