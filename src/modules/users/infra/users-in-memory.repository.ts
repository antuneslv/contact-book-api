import { randomUUID } from 'node:crypto'

import { CreateUser, User, UsersRepository } from '../domain/users.repository'

export class UsersInMemoryRepository implements UsersRepository {
  public users: User[] = []

  findUserByEmail(email: string): Promise<User | null> {
    return Promise.resolve(
      this.users.find(user => user.email === email) ?? null,
    )
  }

  createUser(user: CreateUser): Promise<User> {
    const createdUser = {
      id: randomUUID(),
      name: user.name,
      email: user.email,
      password: user.password,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    this.users.push(createdUser)

    return Promise.resolve(createdUser)
  }
}
