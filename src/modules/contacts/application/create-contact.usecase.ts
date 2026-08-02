import { Injectable, NotFoundException } from '@nestjs/common'
import { format, parse } from 'date-fns'

import { UsersRepository } from '@/modules/users/domain/users.repository'
import { Either, left, right } from '@/utils/either'

import { Category, ContactsRepository } from '../domain/contacts.repository'

export type CreateContactInput = {
  name: string
  phone: string
  email?: string | null
  birthday?: string | null
  category?: Category | null
  observations?: string | null
}

type CreateContactOutput = {
  id: string
  name: string
  phone: string
  email?: string
  birthday?: string
  category?: Category
  observations?: string
  createdAt: Date
  updatedAt: Date
}

type CreateContactUseCaseResponse = Either<
  NotFoundException,
  CreateContactOutput
>

@Injectable()
export class CreateContactUseCase {
  constructor(
    private readonly contactsRepository: ContactsRepository,
    private readonly usersRepository: UsersRepository,
  ) {}

  async execute(
    userId: string,
    data: CreateContactInput,
  ): Promise<CreateContactUseCaseResponse> {
    const user = await this.usersRepository.findUserById(userId)

    if (!user) {
      return left(new NotFoundException('User not found'))
    }

    const birthdayInput = data.birthday
      ? parse(data.birthday, 'yyyy-MM-dd', new Date())
      : undefined

    const contact = await this.contactsRepository.createContact(userId, {
      ...data,
      birthday: birthdayInput,
    })

    const birthdayOutput = contact.birthday
      ? format(contact.birthday, 'yyyy-MM-dd')
      : undefined

    return right({
      id: contact.id,
      name: contact.name,
      phone: contact.phone,
      email: contact.email ?? undefined,
      birthday: birthdayOutput,
      category: contact.category ?? undefined,
      observations: contact.observations ?? undefined,
      createdAt: contact.createdAt,
      updatedAt: contact.updatedAt,
    })
  }
}
