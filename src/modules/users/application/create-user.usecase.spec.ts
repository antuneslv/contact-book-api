import { ConflictException } from '@nestjs/common'

import { FakeHashService } from '@test/crypto/fake-hash.service'
import { UsersInMemoryRepository } from '@test/repositories/users-in-memory.repository'

import { CreateUserUseCase } from './create-user.usecase'

let usersRepository: UsersInMemoryRepository
let hashService: FakeHashService
let sut: CreateUserUseCase

const CREATE_USER_REQUEST = {
  name: 'John Doe',
  email: 'johndoe@example.com',
  password: '123456',
}

describe('CreateUserUseCase', () => {
  beforeEach(() => {
    usersRepository = new UsersInMemoryRepository()
    hashService = new FakeHashService()
    sut = new CreateUserUseCase(usersRepository, hashService)
  })

  it('should create a new user', async () => {
    const result = await sut.execute(CREATE_USER_REQUEST)

    expect(result.isRight()).toBe(true)

    if (result.isLeft()) return

    expect(usersRepository.users[0].id).toEqual(result.value.id)
    expect(usersRepository.users[0].email).toEqual(result.value.email)
    expect(result.value).not.toHaveProperty('password')
  })

  it('should hash user password upon creation', async () => {
    await sut.execute(CREATE_USER_REQUEST)

    const isPasswordCorrectlyHashed = await hashService.compare(
      '123456',
      usersRepository.users[0].password,
    )

    expect(isPasswordCorrectlyHashed).toBe(true)
  })

  it('should not be able to create a user with the same email twice', async () => {
    await sut.execute(CREATE_USER_REQUEST)
    const result = await sut.execute(CREATE_USER_REQUEST)

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ConflictException)
  })
})
