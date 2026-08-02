import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common'

import { HashService } from '@/crypto/hash.service'
import { Either, left, right } from '@/utils/either'

import { UsersRepository } from '../domain/users.repository'

type UpdateUserPasswordInput = {
  currentPassword: string
  newPassword: string
}

type UpdateUserPasswordUseCaseResponse = Either<
  NotFoundException | UnprocessableEntityException,
  null
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
    if (currentPassword === newPassword) {
      return left(
        new UnprocessableEntityException(
          'New password must be different from the current one',
        ),
      )
    }

    const user = await this.usersRepository.findUserById(userId)

    if (!user) {
      return left(new NotFoundException('User not found'))
    }

    const isCurrentPasswordValid = await this.hashService.compare(
      currentPassword,
      user.password,
    )

    if (!isCurrentPasswordValid) {
      return left(new UnprocessableEntityException('Invalid current password'))
    }

    const hashedPassword = await this.hashService.hash(newPassword)

    await this.usersRepository.updateUserPassword(userId, hashedPassword)

    return right(null)
  }
}
