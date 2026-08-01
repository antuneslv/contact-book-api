import { Server } from 'node:http'

import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'

import { AppModule } from '@/app.module'
import { HashService } from '@/crypto/hash.service'
import { TokenService } from '@/crypto/token.service'
import { PrismaService } from '@/database/prisma.service'

type CreateUserResponse = {
  statusCode: number
  body: {
    id: string
    name: string
    email: string
    createdAt: Date
  }
}

describe('Users (E2E)', () => {
  let app: INestApplication<Server>
  let prismaService: PrismaService
  let tokenService: TokenService
  let hashService: HashService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleRef.createNestApplication()

    prismaService = moduleRef.get(PrismaService)
    tokenService = moduleRef.get(TokenService)
    hashService = moduleRef.get(HashService)
    await app.init()
  })

  let user: CreateUserResponse['body']

  test('[POST] /users', async () => {
    const response: CreateUserResponse = await request(app.getHttpServer())
      .post('/users')
      .send({
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: '123456',
      })

    user = response.body

    expect(response.statusCode).toBe(201)

    const userOnDatabase = await prismaService.user.findUnique({
      where: {
        id: user.id,
      },
    })

    expect(userOnDatabase).toBeTruthy()
  })

  test('[GET] /users/me', async () => {
    const accessToken = tokenService.generate({ sub: user.id })

    const response = await request(app.getHttpServer())
      .get('/users/me')
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual(user)
  })

  test('[PATCH] /users/me', async () => {
    const accessToken = tokenService.generate({ sub: user.id })

    const response: CreateUserResponse = await request(app.getHttpServer())
      .patch('/users/me')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'John Doe Jr.',
        email: 'john.doe.jr@example.com',
      })

    user = response.body

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual(user)
  })

  test('[PATCH] /users/me/password', async () => {
    const accessToken = tokenService.generate({ sub: user.id })

    const response = await request(app.getHttpServer())
      .patch('/users/me/password')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        currentPassword: '123456',
        newPassword: '654321',
      })

    expect(response.statusCode).toBe(204)

    const userOnDatabase = await prismaService.user.findUnique({
      where: {
        id: user.id,
      },
    })

    if (!userOnDatabase) return

    const isPasswordValid = await hashService.compare(
      '654321',
      userOnDatabase.password,
    )

    expect(isPasswordValid).toBe(true)
  })

  test('[DELETE] /users/me', async () => {
    const accessToken = tokenService.generate({ sub: user.id })

    const response = await request(app.getHttpServer())
      .delete('/users/me')
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(204)

    const userOnDatabase = await prismaService.user.findUnique({
      where: {
        id: user.id,
      },
    })

    expect(userOnDatabase).toBeFalsy()
  })
})
