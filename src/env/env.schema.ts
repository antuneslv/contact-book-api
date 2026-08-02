import { z } from 'zod'

import { isDuration } from '@/utils/duration'

export const envSchema = z.object({
  DATABASE_URL: z.url(),
  JWT_SECRET: z.string().min(32),
  JWT_EXPIRES_IN: z
    .string()
    .refine(isDuration, {
      message: 'JWT_EXPIRES_IN must be a value like 30s, 15m, 2h or 7d',
    })
    .default('30m'),
  PORT: z.coerce.number().default(3000),
})

export type Env = z.infer<typeof envSchema>
