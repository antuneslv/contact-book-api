import { Server } from 'node:http'

import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'

import { AppModule } from '@/app.module'
import { setupApp } from '@/config/app'
import { CryptoModule } from '@/crypto/crypto.module'
import { HashService } from '@/crypto/hash.service'
import { TokenService } from '@/crypto/token.service'
import { PrismaService } from '@/database/prisma.service'
import { UserFactory } from '@test/factories/user.factory'

import { UserResponse } from './dtos/user.response'

type SerializedUserResponse = Omit<UserResponse, 'createdAt'> & {
  createdAt: string
}

type UserHttpResponse = {
  statusCode: number
  body: SerializedUserResponse
}

describe('Users (E2E)', () => {
  let app: INestApplication<Server>
  let prismaService: PrismaService
  let tokenService: TokenService
  let hashService: HashService
  let userFactory: UserFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, CryptoModule],
      providers: [UserFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    setupApp(app)

    prismaService = moduleRef.get(PrismaService)
    tokenService = moduleRef.get(TokenService)
    hashService = moduleRef.get(HashService)
    userFactory = moduleRef.get(UserFactory)

    await app.init()
  })

  afterAll(async () => {
    await app.close()
  })

  test('[POST] /api/users', async () => {
    const response: UserHttpResponse = await request(app.getHttpServer())
      .post('/api/users')
      .send({
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: '123456',
      })

    expect(response.statusCode).toBe(201)
    expect(response.body).toMatchObject({
      name: 'John Doe',
      email: 'john.doe@example.com',
    })

    const userOnDatabase = await prismaService.user.findUnique({
      where: {
        id: response.body.id,
      },
    })

    expect(userOnDatabase).toBeTruthy()
    expect(userOnDatabase?.password).not.toBe('123456')
  })

  test('[GET] /api/users/me', async () => {
    const { user } = await userFactory.makePrismaUser()

    const accessToken = tokenService.generate({ sub: user.id })

    const response = await request(app.getHttpServer())
      .get('/api/users/me')
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt.toISOString(),
    })
  })

  test('[PATCH] /api/users/me', async () => {
    const { user } = await userFactory.makePrismaUser()

    const accessToken = tokenService.generate({ sub: user.id })

    const response = await request(app.getHttpServer())
      .patch('/api/users/me')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'John Doe Jr.',
      })

    expect(response.statusCode).toBe(200)
    expect(response.body).toMatchObject({
      id: user.id,
      name: 'John Doe Jr.',
      email: user.email,
    })

    const userOnDatabase = await prismaService.user.findUnique({
      where: {
        id: user.id,
      },
    })

    expect(userOnDatabase?.name).toBe('John Doe Jr.')
    expect(userOnDatabase?.email).toBe(user.email)
  })

  test('[PATCH] /api/users/me/password', async () => {
    const { user, password } = await userFactory.makePrismaUser()

    const accessToken = tokenService.generate({ sub: user.id })

    const response = await request(app.getHttpServer())
      .patch('/api/users/me/password')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        currentPassword: password,
        newPassword: '654321',
      })

    expect(response.statusCode).toBe(204)

    const userOnDatabase = await prismaService.user.findUnique({
      where: {
        id: user.id,
      },
    })

    expect(userOnDatabase).toBeTruthy()

    const isPasswordValid = await hashService.compare(
      '654321',
      userOnDatabase?.password ?? '',
    )

    expect(isPasswordValid).toBe(true)
  })

  test('[DELETE] /api/users/me', async () => {
    const { user } = await userFactory.makePrismaUser()

    const accessToken = tokenService.generate({ sub: user.id })

    const response = await request(app.getHttpServer())
      .delete('/api/users/me')
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(204)

    const userOnDatabase = await prismaService.user.findUnique({
      where: {
        id: user.id,
      },
    })

    expect(userOnDatabase).toBeFalsy()
  })
})
