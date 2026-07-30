import ms, { StringValue } from 'ms'
import { z } from 'zod'

const stringExpiresInSchema = z
  .string()
  .refine(
    (value): value is StringValue => ms(value as StringValue) !== undefined,
    {
      message:
        'JWT_EXPIRES_IN must be a valid value like 5m, 1h, 2 days, or 100',
    },
  )

export const envSchema = z.object({
  DATABASE_URL: z.url(),
  JWT_SECRET: z.string().min(32),
  JWT_EXPIRES_IN: z.union([z.number(), stringExpiresInSchema]).default('5m'),
  PORT: z.coerce.number().default(3000),
})

export type Env = z.infer<typeof envSchema>
