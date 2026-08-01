import { randomUUID } from 'node:crypto'

import { User } from '@/generated/prisma/client'
import {
  CreateUser,
  UpdateUserData,
  UsersRepository,
} from '@/modules/users/domain/users.repository'

export class UsersInMemoryRepository implements UsersRepository {
  public users: User[] = []

  findUserById(id: string): Promise<User | null> {
    return Promise.resolve(this.users.find(user => user.id === id) ?? null)
  }

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

  updateUser(id: string, data: UpdateUserData): Promise<User> {
    const userIndex = this.users.findIndex(user => user.id === id)

    if (userIndex === -1) {
      throw new Error('User not found')
    }

    const definedData = Object.fromEntries(
      Object.entries(data).filter(([, value]) => value !== undefined),
    )

    const updatedUser = {
      ...this.users[userIndex],
      ...definedData,
      updatedAt: new Date(),
    }

    this.users[userIndex] = updatedUser

    return Promise.resolve(updatedUser)
  }

  updateUserPassword(id: string, password: string): Promise<User> {
    const userIndex = this.users.findIndex(user => user.id === id)

    if (userIndex === -1) {
      throw new Error('User not found.')
    }

    const updatedUser = {
      ...this.users[userIndex],
      password,
      updatedAt: new Date(),
    }

    this.users[userIndex] = updatedUser

    return Promise.resolve(updatedUser)
  }

  deleteUser(id: string): Promise<void> {
    const userIndex = this.users.findIndex(user => user.id === id)

    if (userIndex === -1) {
      throw new Error('User not found.')
    }

    this.users.splice(userIndex, 1)

    return Promise.resolve()
  }
}
