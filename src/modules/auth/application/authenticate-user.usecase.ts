import { Injectable, UnauthorizedException } from '@nestjs/common'

import { HashService } from '@/crypto/hash.service'
import { TokenService } from '@/crypto/token.service'
import { UsersRepository } from '@/modules/users/domain/users.repository'
import { Either, left, right } from '@/utils/either'

type AuthenticateUserInput = {
  email: string
  password: string
}

type AuthenticateUserOutput = { accessToken: string }

type AuthenticateUserUseCaseResponse = Either<
  UnauthorizedException,
  AuthenticateUserOutput
>

@Injectable()
export class AuthenticateUserUseCase {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly hashService: HashService,
    private readonly tokenService: TokenService,
  ) {}

  async execute({
    email,
    password,
  }: AuthenticateUserInput): Promise<AuthenticateUserUseCaseResponse> {
    const user = await this.usersRepository.findUserByEmail(email)

    if (!user) {
      return left(new UnauthorizedException('Invalid credentials'))
    }

    const isPasswordValid = await this.hashService.compare(
      password,
      user.password,
    )

    if (!isPasswordValid) {
      return left(new UnauthorizedException('Invalid credentials'))
    }

    const accessToken = this.tokenService.generate({ sub: user.id })

    return right({ accessToken })
  }
}
