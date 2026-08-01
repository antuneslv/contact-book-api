import { UnauthorizedException } from '@nestjs/common'

import { FakeHashService } from '@test/crypto/fake-hash.service'
import { FakeTokenService } from '@test/crypto/fake-token.service'
import { UsersInMemoryRepository } from '@test/repositories/users-in-memory.repository'

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

  it('should return a generic unauthorized error when authenticating with an invalid password', async () => {
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

  it('should return a generic unauthorized error when authenticating with an invalid email', async () => {
    const password = await hashService.hash('123456')

    await usersRepository.createUser({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password,
    })

    const result = await sut.execute({
      email: 'another.email@example.com',
      password: '123456',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(UnauthorizedException)
  })
})
