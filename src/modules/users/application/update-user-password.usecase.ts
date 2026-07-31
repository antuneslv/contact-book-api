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

type UpdateUserPasswordUseCaseResponse = Either<
  NotFoundException | ForbiddenException,
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

    const hashedPassword = await this.hashService.hash(newPassword)

    await this.usersRepository.updateUserPassword(userId, hashedPassword)

    return right(null)
  }
}
