import { Server } from 'node:http'

import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'

import { AppModule } from '@/app.module'
import { setupApp } from '@/config/app'
import { CryptoModule } from '@/crypto/crypto.module'
import { TokenService } from '@/crypto/token.service'
import { PrismaService } from '@/database/prisma.service'
import { ContactFactory } from '@test/factories/contact.factory'
import { UserFactory } from '@test/factories/user.factory'

import { ContactResponse } from './dtos/contact.response'

type SerializedContactResponse = Omit<
  ContactResponse,
  'createdAt' | 'updatedAt'
> & {
  createdAt: string
  updatedAt: string
}

type ContactHttpResponse = {
  statusCode: number
  body: SerializedContactResponse
}

type ContactListHttpResponse = {
  statusCode: number
  body: { contacts: SerializedContactResponse[] }
}

describe('Contacts (E2E)', () => {
  let app: INestApplication<Server>
  let prismaService: PrismaService
  let tokenService: TokenService
  let userFactory: UserFactory
  let contactFactory: ContactFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, CryptoModule],
      providers: [UserFactory, ContactFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    setupApp(app)

    prismaService = moduleRef.get(PrismaService)
    tokenService = moduleRef.get(TokenService)
    userFactory = moduleRef.get(UserFactory)
    contactFactory = moduleRef.get(ContactFactory)

    await app.init()
  })

  afterAll(async () => {
    await app.close()
  })

  async function makeAuthenticatedUser() {
    const { user } = await userFactory.makePrismaUser()

    return { user, accessToken: tokenService.generate({ sub: user.id }) }
  }

  test('[POST] /api/contacts', async () => {
    const { user, accessToken } = await makeAuthenticatedUser()

    const response: ContactHttpResponse = await request(app.getHttpServer())
      .post('/api/contacts')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'John Doe',
        phone: '+1 555 000 0000',
        email: 'john.doe@example.com',
        birthday: '1990-01-20',
        category: 'FRIENDS',
        observations: 'Met at the conference',
      })

    expect(response.statusCode).toBe(201)
    expect(response.body).toMatchObject({
      name: 'John Doe',
      phone: '+1 555 000 0000',
      email: 'john.doe@example.com',
      birthday: '1990-01-20',
      category: 'FRIENDS',
      observations: 'Met at the conference',
    })

    const contactOnDatabase = await prismaService.contact.findUnique({
      where: { id: response.body.id },
    })

    expect(contactOnDatabase).toBeTruthy()
    expect(contactOnDatabase?.userId).toBe(user.id)
    expect(contactOnDatabase?.birthday?.toISOString()).toBe(
      '1990-01-20T00:00:00.000Z',
    )
  })

  test('[POST] /api/contacts with only the required fields', async () => {
    const { accessToken } = await makeAuthenticatedUser()

    const response: ContactHttpResponse = await request(app.getHttpServer())
      .post('/api/contacts')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ name: 'Jane Doe', phone: '+1 555 111 1111' })

    expect(response.statusCode).toBe(201)
    expect(response.body).toMatchObject({
      email: null,
      birthday: null,
      category: null,
      observations: null,
    })
  })

  test('[GET] /api/contacts', async () => {
    const { user, accessToken } = await makeAuthenticatedUser()
    const { user: anotherUser } = await userFactory.makePrismaUser()

    await contactFactory.makePrismaContact(user.id, { name: 'Zeca' })
    await contactFactory.makePrismaContact(user.id, { name: 'Ana' })
    await contactFactory.makePrismaContact(anotherUser.id, { name: 'Intruder' })

    const response: ContactListHttpResponse = await request(app.getHttpServer())
      .get('/api/contacts')
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(200)
    expect(response.body.contacts.map(contact => contact.name)).toEqual([
      'Ana',
      'Zeca',
    ])
  })

  test('[GET] /api/contacts/:id', async () => {
    const { user, accessToken } = await makeAuthenticatedUser()
    const contact = await contactFactory.makePrismaContact(user.id)

    const response: ContactHttpResponse = await request(app.getHttpServer())
      .get(`/api/contacts/${contact.id}`)
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({
      id: contact.id,
      name: contact.name,
      phone: contact.phone,
      email: contact.email,
      birthday: contact.birthday?.toISOString().slice(0, 10) ?? null,
      category: contact.category,
      observations: contact.observations,
      createdAt: contact.createdAt.toISOString(),
      updatedAt: contact.updatedAt.toISOString(),
    })
  })

  test('[PUT] /api/contacts/:id', async () => {
    const { user, accessToken } = await makeAuthenticatedUser()
    const contact = await contactFactory.makePrismaContact(user.id)

    const response: ContactHttpResponse = await request(app.getHttpServer())
      .put(`/api/contacts/${contact.id}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'John Doe Jr.',
        phone: '+1 555 222 2222',
        email: null,
        birthday: '2000-12-31',
        category: 'WORK',
        observations: null,
      })

    expect(response.statusCode).toBe(200)
    expect(response.body).toMatchObject({
      id: contact.id,
      name: 'John Doe Jr.',
      phone: '+1 555 222 2222',
      email: null,
      birthday: '2000-12-31',
      category: 'WORK',
      observations: null,
    })

    const contactOnDatabase = await prismaService.contact.findUnique({
      where: { id: contact.id },
    })

    expect(contactOnDatabase?.name).toBe('John Doe Jr.')
    expect(contactOnDatabase?.email).toBeNull()
    expect(contactOnDatabase?.observations).toBeNull()
    expect(contactOnDatabase?.birthday?.toISOString()).toBe(
      '2000-12-31T00:00:00.000Z',
    )
    expect(contactOnDatabase?.createdAt.toISOString()).toBe(
      contact.createdAt.toISOString(),
    )
  })

  test('[DELETE] /api/contacts/:id', async () => {
    const { user, accessToken } = await makeAuthenticatedUser()
    const contact = await contactFactory.makePrismaContact(user.id)
    const survivor = await contactFactory.makePrismaContact(user.id)

    const response = await request(app.getHttpServer())
      .delete(`/api/contacts/${contact.id}`)
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(204)

    const contactOnDatabase = await prismaService.contact.findUnique({
      where: { id: contact.id },
    })

    expect(contactOnDatabase).toBeNull()

    const survivorOnDatabase = await prismaService.contact.findUnique({
      where: { id: survivor.id },
    })

    expect(survivorOnDatabase).toBeTruthy()
  })

  test('a contact owned by someone else is invisible on every route', async () => {
    const { accessToken } = await makeAuthenticatedUser()
    const { user: owner } = await userFactory.makePrismaUser()
    const contact = await contactFactory.makePrismaContact(owner.id, {
      name: 'Secret',
    })

    const get = await request(app.getHttpServer())
      .get(`/api/contacts/${contact.id}`)
      .set('Authorization', `Bearer ${accessToken}`)

    const put = await request(app.getHttpServer())
      .put(`/api/contacts/${contact.id}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Hacked',
        phone: '+1 555 333 3333',
        email: null,
        birthday: null,
        category: null,
        observations: null,
      })

    const remove = await request(app.getHttpServer())
      .delete(`/api/contacts/${contact.id}`)
      .set('Authorization', `Bearer ${accessToken}`)

    expect([get.statusCode, put.statusCode, remove.statusCode]).toEqual([
      404, 404, 404,
    ])

    const contactOnDatabase = await prismaService.contact.findUnique({
      where: { id: contact.id },
    })

    expect(contactOnDatabase?.name).toBe('Secret')
  })
})
