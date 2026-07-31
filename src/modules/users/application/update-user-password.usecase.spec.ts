import { randomUUID } from 'node:crypto'

import { ForbiddenException, NotFoundException } from '@nestjs/common'

import { FakeHashService } from '@/crypto/fake-hash.service'

import { UpdateUserPasswordUseCase } from './update-user-password.usecase'
import { UsersInMemoryRepository } from '../infra/users-in-memory.repository'

let usersRepository: UsersInMemoryRepository
let hashService: FakeHashService
let sut: UpdateUserPasswordUseCase

const USER_ID = randomUUID()
const ANOTHER_USER_ID = randomUUID()

describe('UpdateUserPasswordUseCase', () => {
  beforeEach(() => {
    usersRepository = new UsersInMemoryRepository()
    hashService = new FakeHashService()
    sut = new UpdateUserPasswordUseCase(usersRepository, hashService)
  })

  it('should update user password', async () => {
    const hashedPassword = await hashService.hash('123456')

    usersRepository.users.push({
      id: USER_ID,
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    const result = await sut.execute(USER_ID, {
      currentPassword: '123456',
      newPassword: 'abcdef',
    })

    expect(result.isRight()).toBe(true)

    if (result.isLeft()) return

    expect(result.value).toBeNull()
  })

  it('should hash user password upon update', async () => {
    const hashedPassword = await hashService.hash('123456')

    usersRepository.users.push({
      id: USER_ID,
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    await sut.execute(USER_ID, {
      currentPassword: '123456',
      newPassword: 'abcdef',
    })

    const isPasswordCorrectlyHashed = await hashService.compare(
      'abcdef',
      usersRepository.users[0].password,
    )

    expect(isPasswordCorrectlyHashed).toBe(true)
  })

  it("should not be able to update another's user password", async () => {
    const hashedPassword = await hashService.hash('123456')

    usersRepository.users.push({
      id: USER_ID,
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    const result = await sut.execute(ANOTHER_USER_ID, {
      currentPassword: '123456',
      newPassword: 'abcdef',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotFoundException)
  })

  it('should not be able to update user password if current password if incorrectly', async () => {
    const hashedPassword = await hashService.hash('123456')

    usersRepository.users.push({
      id: USER_ID,
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    const result = await sut.execute(USER_ID, {
      currentPassword: '654321',
      newPassword: 'abcdef',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ForbiddenException)
  })
})
