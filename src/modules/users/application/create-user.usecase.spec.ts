import { ConflictException } from '@nestjs/common'

import { BcryptHashService } from '@/crypto/bcrypt-hash-service'

import { CreateUserUseCase } from './create-user.usecase'
import { UsersInMemoryRepository } from '../infra/users-in-memory.repository'

let usersRepository: UsersInMemoryRepository
let bcryptHashService: BcryptHashService
let sut: CreateUserUseCase

const createUserRequest = {
  name: 'John Doe',
  email: 'johndoe@example.com',
  password: '123456',
}

describe('CreateUserUseCase', () => {
  beforeEach(() => {
    usersRepository = new UsersInMemoryRepository()
    bcryptHashService = new BcryptHashService()
    sut = new CreateUserUseCase(usersRepository, bcryptHashService)
  })

  it('should create a new user', async () => {
    const result = await sut.execute(createUserRequest)

    expect(result.isRight()).toBe(true)

    if (result.isLeft()) return

    expect(usersRepository.users[0].id).toEqual(result.value.id)
    expect(usersRepository.users[0].email).toEqual(result.value.email)
    expect(result.value).not.toHaveProperty('password')
  })

  it('should hash user password upon creation', async () => {
    await sut.execute(createUserRequest)

    const isPasswordCorrectlyHashed = await bcryptHashService.compare(
      '123456',
      usersRepository.users[0].password,
    )

    expect(isPasswordCorrectlyHashed).toBe(true)
  })

  it('should not be able to create a user with the same email twice', async () => {
    await sut.execute(createUserRequest)
    const result = await sut.execute(createUserRequest)

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ConflictException)
  })
})
