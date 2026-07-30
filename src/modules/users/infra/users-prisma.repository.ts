import { Injectable } from '@nestjs/common'

import { PrismaService } from '@/database/prisma.service'

import { CreateUser, User, UsersRepository } from '../domain/users.repository'

@Injectable()
export class UsersPrismaRepository implements UsersRepository {
  constructor(private readonly prismaService: PrismaService) {}

  findUserById(id: string): Promise<User | null> {
    return this.prismaService.user.findUnique({
      where: {
        id,
      },
    })
  }

  findUserByEmail(email: string): Promise<User | null> {
    return this.prismaService.user.findUnique({
      where: {
        email,
      },
    })
  }

  createUser({ name, email, password }: CreateUser): Promise<User> {
    return this.prismaService.user.create({
      data: {
        name,
        email,
        password,
      },
    })
  }
}
