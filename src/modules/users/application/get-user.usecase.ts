import { Injectable, NotFoundException } from '@nestjs/common'

import { Either, left, right } from '@/utils/either'

import { UsersRepository } from '../domain/users.repository'

type GetUserOutput = {
  id: string
  name: string
  email: string
  createdAt: Date
}

type GetUserUseCaseResponse = Either<NotFoundException, GetUserOutput>

@Injectable()
export class GetUserUseCase {
  constructor(private readonly usersRepository: UsersRepository) {}

  async execute(id: string): Promise<GetUserUseCaseResponse> {
    const user = await this.usersRepository.findUserById(id)

    if (!user) {
      return left(new NotFoundException('User not found'))
    }

    return right({
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    })
  }
}
