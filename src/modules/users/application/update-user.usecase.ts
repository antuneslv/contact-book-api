import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'

import { Either, left, right } from '@/utils/either/either'

import { UsersRepository } from '../domain/users.repository'

type UpdateUserInput = {
  name?: string
  email?: string
}

type UpdateUserOutput = {
  id: string
  name: string
  email: string
  createdAt: Date
}

type UpdateUserUseCaseResponse = Either<
  NotFoundException | ConflictException,
  UpdateUserOutput
>

@Injectable()
export class UpdateUserUseCase {
  constructor(private readonly usersRepository: UsersRepository) {}

  async execute(
    userId: string,
    data: UpdateUserInput,
  ): Promise<UpdateUserUseCaseResponse> {
    const user = await this.usersRepository.findUserById(userId)

    if (!user) {
      return left(new NotFoundException('User not found'))
    }

    if (data?.email) {
      const userWithSameEmail = await this.usersRepository.findUserByEmail(
        data.email,
      )

      if (userWithSameEmail && userWithSameEmail.email !== user.email) {
        return left(new ConflictException('E-mail already taken'))
      }
    }

    const updatedUser = await this.usersRepository.updateUser(userId, data)

    return right({
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      createdAt: updatedUser.createdAt,
    })
  }
}
