import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common'

import { TokenPayload } from '@/crypto/token.service'
import { RequestWithUser } from '@/guards/auth.guard'

export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext): TokenPayload => {
    const { user } = context.switchToHttp().getRequest<RequestWithUser>()

    if (!user) {
      throw new InternalServerErrorException(
        '@CurrentUser requires a route protected by AuthGuard',
      )
    }

    return user
  },
)
