import { UnauthorizedException } from '@nestjs/common'

import { FakeHashService } from '@/crypto/fake-hash.service'
import { FakeTokenService } from '@/crypto/fake-token.service'
import { UsersInMemoryRepository } from '@/modules/users/infra/users-in-memory.repository'

import { AuthenticateUserUseCase } from './authenticate-user.usecase'

let usersRepository: UsersInMemoryRepository
let hashService: FakeHashService
let tokenService: FakeTokenService
let sut: AuthenticateUserUseCase

const USER_CREDENTIALS = {
  email: 'johndoe@example.com',
  password: '123456',
}

describe('AuthenticateUserUseCase', () => {
  beforeEach(() => {
    usersRepository = new UsersInMemoryRepository()
    hashService = new FakeHashService()
    tokenService = new FakeTokenService()
    sut = new AuthenticateUserUseCase(
      usersRepository,
      hashService,
      tokenService,
    )
  })

  it('should authenticate a user', async () => {
    const password = await hashService.hash('123456')

    const user = await usersRepository.createUser({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password,
    })

    const result = await sut.execute(USER_CREDENTIALS)

    expect(result.isRight()).toBe(true)

    expect(result.value).toEqual({
      accessToken: tokenService.generate({ sub: user.id }),
    })
  })

  it('should not be able to authenticate a user with wrong credentials', async () => {
    const password = await hashService.hash('abcdef')

    await usersRepository.createUser({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password,
    })

    const result = await sut.execute(USER_CREDENTIALS)

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(UnauthorizedException)
  })

  it('should not be able to authenticate a user if email is not provided', async () => {
    const password = await hashService.hash('123456')

    await usersRepository.createUser({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password,
    })

    const result = await sut.execute({
      password: '123456',
    } as typeof USER_CREDENTIALS)

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(UnauthorizedException)
  })
})
