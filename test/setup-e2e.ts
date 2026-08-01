import 'dotenv/config'

import { execSync } from 'node:child_process'
import { randomUUID } from 'node:crypto'

import { PrismaPg } from '@prisma/adapter-pg'

import { PrismaClient } from '@/generated/prisma/client'

const schemaId = randomUUID()

function generateUniqueDatabaseURL(schemaId: string) {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL environment variable is required')
  }

  const url = new URL(process.env.DATABASE_URL)

  url.searchParams.set('schema', schemaId)

  return url.toString()
}

const databaseURL = generateUniqueDatabaseURL(schemaId)
process.env.DATABASE_URL = databaseURL

let prisma: PrismaClient

beforeAll(() => {
  const adapter = new PrismaPg({ connectionString: databaseURL })

  prisma = new PrismaClient({ adapter })

  execSync('npx prisma migrate deploy')
})

afterAll(async () => {
  await prisma.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${schemaId}" CASCADE`)
  await prisma.$disconnect()
})
