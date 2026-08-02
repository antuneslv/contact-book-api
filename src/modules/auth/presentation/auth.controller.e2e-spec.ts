import { Server } from 'node:http'

import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'

import { AppModule } from '@/app.module'
import { setupApp } from '@/config/app'
import { CryptoModule } from '@/crypto/crypto.module'
import { UserFactory } from '@test/factories/user.factory'

import { AuthenticateUserResponse } from './dtos/authenticate-user.response'

type AuthHttpResponse = {
  statusCode: number
  body: AuthenticateUserResponse
}

describe('Auth (E2E)', () => {
  let app: INestApplication<Server>
  let userFactory: UserFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, CryptoModule],
      providers: [UserFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    setupApp(app)

    userFactory = moduleRef.get(UserFactory)

    await app.init()
  })

  afterAll(async () => {
    await app.close()
  })

  test('[POST] /api/auth/login', async () => {
    const { user, password } = await userFactory.makePrismaUser()

    const response: AuthHttpResponse = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({
        email: user.email,
        password,
      })

    expect(response.statusCode).toBe(200)

    const meResponse = await request(app.getHttpServer())
      .get('/api/users/me')
      .set('Authorization', `Bearer ${response.body.accessToken}`)

    expect(meResponse.statusCode).toBe(200)
  })
})
