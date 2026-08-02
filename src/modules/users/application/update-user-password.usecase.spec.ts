import { randomUUID } from 'node:crypto'

import { NotFoundException, UnprocessableEntityException } from '@nestjs/common'

import { FakeHashService } from '@test/crypto/fake-hash.service'
import { makeUser } from '@test/factories/user.factory'
import { UsersInMemoryRepository } from '@test/repositories/users-in-memory.repository'

import { UpdateUserPasswordUseCase } from './update-user-password.usecase'

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

    usersRepository.users.push(
      makeUser({ id: USER_ID, password: hashedPassword }),
    )

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

    usersRepository.users.push(
      makeUser({ id: USER_ID, password: hashedPassword }),
    )

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

  it('should return not found when the user does not exist', async () => {
    const hashedPassword = await hashService.hash('123456')

    usersRepository.users.push(
      makeUser({ id: USER_ID, password: hashedPassword }),
    )

    const result = await sut.execute(ANOTHER_USER_ID, {
      currentPassword: '123456',
      newPassword: 'abcdef',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotFoundException)
  })

  it('should not allow the new password to be the same as the current one', async () => {
    const hashedPassword = await hashService.hash('123456')

    usersRepository.users.push(
      makeUser({ id: USER_ID, password: hashedPassword }),
    )

    const result = await sut.execute(USER_ID, {
      currentPassword: '123456',
      newPassword: '123456',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(UnprocessableEntityException)
  })

  it('should not update the password when the current password is incorrect', async () => {
    const hashedPassword = await hashService.hash('123456')

    usersRepository.users.push(
      makeUser({ id: USER_ID, password: hashedPassword }),
    )

    const result = await sut.execute(USER_ID, {
      currentPassword: '654321',
      newPassword: 'abcdef',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(UnprocessableEntityException)
  })
})
