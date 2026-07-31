import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'

import { HashService } from '@/crypto/hash.service'
import { Either, left, right } from '@/utils/either/either'

import { UsersRepository } from '../domain/users.repository'

type UpdateUserPasswordInput = {
  currentPassword: string
  newPassword: string
}

type UpdateUserPasswordOutput = {
  id: string
  name: string
  email: string
  createdAt: Date
}

type UpdateUserPasswordUseCaseResponse = Either<
  NotFoundException | ForbiddenException,
  UpdateUserPasswordOutput
>

@Injectable()
export class UpdateUserPasswordUseCase {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly hashService: HashService,
  ) {}

  async execute(
    userId: string,
    { currentPassword, newPassword }: UpdateUserPasswordInput,
  ): Promise<UpdateUserPasswordUseCaseResponse> {
    const user = await this.usersRepository.findUserById(userId)

    if (!user) {
      return left(new NotFoundException('User not found'))
    }

    const doesPasswordsMatches = await this.hashService.compare(
      currentPassword,
      user.password,
    )

    if (!doesPasswordsMatches) {
      return left(new ForbiddenException('Invalid current password'))
    }

    const updatedUser = await this.usersRepository.updateUserPassword(
      userId,
      newPassword,
    )

    return right({
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      createdAt: updatedUser.createdAt,
    })
  }
}
