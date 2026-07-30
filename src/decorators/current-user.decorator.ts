import { createParamDecorator, ExecutionContext } from '@nestjs/common'

import { TokenPayload } from '../crypto/token.service'

type RequestWithUser = {
  user?: TokenPayload
}

export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest<RequestWithUser>()

    return request.user
  },
)
