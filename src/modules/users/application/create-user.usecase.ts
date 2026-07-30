import { ConflictException, Injectable } from '@nestjs/common'

import { HashService } from '@/crypto/hash.service'
import { Either, left, right } from '@/utils/either/either'

import { UsersRepository } from '../domain/users.repository'

type CreateUserInput = {
  name: string
  email: string
  password: string
}

type CreateUserOutput = {
  id: string
  name: string
  email: string
  createdAt: Date
}

type CreateUserUseCaseResponse = Either<ConflictException, CreateUserOutput>

@Injectable()
export class CreateUserUseCase {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly hashService: HashService,
  ) {}

  async execute({
    name,
    email,
    password,
  }: CreateUserInput): Promise<CreateUserUseCaseResponse> {
    const existingUser = await this.usersRepository.findUserByEmail(email)

    if (existingUser) {
      return left(new ConflictException('User already exists'))
    }

    const hashedPassword = await this.hashService.hash(password)

    const user = await this.usersRepository.createUser({
      name,
      email,
      password: hashedPassword,
    })

    return right({
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    })
  }
}
