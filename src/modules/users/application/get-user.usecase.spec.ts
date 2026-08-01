import { randomUUID } from 'node:crypto'

import { NotFoundException } from '@nestjs/common'

import { UsersInMemoryRepository } from '@test/repositories/users-in-memory.repository'

import { GetUserUseCase } from './get-user.usecase'

let usersRepository: UsersInMemoryRepository
let sut: GetUserUseCase

const USER_ID = randomUUID()

describe('GetUserUseCase', () => {
  beforeEach(() => {
    usersRepository = new UsersInMemoryRepository()
    sut = new GetUserUseCase(usersRepository)
  })

  it('should get user', async () => {
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

    expect(usersRepository.users[0].id).toEqual(result.value.id)
    expect(usersRepository.users[0].email).toEqual(result.value.email)
    expect(result.value).not.toHaveProperty('password')
  })

  it('should return a not found exception error when it fails to find a user', async () => {
    const result = await sut.execute(USER_ID)

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotFoundException)
  })
})
