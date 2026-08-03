import { Injectable } from '@nestjs/common'

import { PrismaService } from '@/database/prisma.service'

import {
  Contact,
  ContactsRepository,
  ContactData,
} from '../domain/contacts.repository'

@Injectable()
export class ContactsPrismaRepository implements ContactsRepository {
  constructor(private readonly prismaService: PrismaService) {}

  createContact(userId: string, data: ContactData): Promise<Contact> {
    return this.prismaService.contact.create({
      data: {
        ...data,
        userId,
      },
    })
  }

  fetchContacts(userId: string): Promise<Contact[]> {
    return this.prismaService.contact.findMany({
      where: {
        userId,
      },
      orderBy: {
        name: 'asc',
      },
    })
  }

  findContactByIdAndUserId(
    id: string,
    userId: string,
  ): Promise<Contact | null> {
    return this.prismaService.contact.findFirst({
      where: {
        id,
        userId,
      },
    })
  }

  updateContact(
    id: string,
    userId: string,
    data: ContactData,
  ): Promise<Contact> {
    return this.prismaService.contact.update({
      where: {
        id,
        userId,
      },
      data,
    })
  }

  async deleteContact(id: string, userId: string): Promise<void> {
    await this.prismaService.contact.delete({
      where: {
        id,
        userId,
      },
    })
  }
}
