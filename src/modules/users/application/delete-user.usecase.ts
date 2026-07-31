import { Injectable, NotFoundException } from '@nestjs/common'

import { Either, left, right } from '@/utils/either/either'

import { UsersRepository } from '../domain/users.repository'

type DeleteUserUseCaseResponse = Either<NotFoundException, null>

@Injectable()
export class DeleteUserUseCase {
  constructor(private readonly usersRepository: UsersRepository) {}

  async execute(userId: string): Promise<DeleteUserUseCaseResponse> {
    const user = await this.usersRepository.findUserById(userId)

    if (!user) {
      return left(new NotFoundException('User not found'))
    }

    await this.usersRepository.deleteUser(userId)

    return right(null)
  }
}
