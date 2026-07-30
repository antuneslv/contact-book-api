export type User = {
  id: string
  name: string
  email: string
  password: string
  createdAt: Date
  updatedAt: Date
}

export type CreateUser = Omit<User, 'id' | 'createdAt' | 'updatedAt'>

export abstract class UsersRepository {
  abstract findUserById(id: string): Promise<User | null>
  abstract findUserByEmail(email: string): Promise<User | null>
  abstract createUser(user: CreateUser): Promise<User>
}
