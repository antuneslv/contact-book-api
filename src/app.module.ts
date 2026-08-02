import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { PrismaModule } from './database/prisma.module'
import { EnvModule } from './env/env.module'
import { envSchema } from './env/env.schema'
import { AuthModule } from './modules/auth/auth.module'
import { ContactsModule } from './modules/contacts/contacts.module'
import { UsersModule } from './modules/users/users.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: env => envSchema.parse(env),
    }),
    AuthModule,
    EnvModule,
    PrismaModule,
    UsersModule,
    ContactsModule,
  ],
})
export class AppModule {}
