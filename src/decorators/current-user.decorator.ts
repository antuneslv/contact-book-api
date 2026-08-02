import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common'

import { TokenPayload } from '@/crypto/token.service'
import { RequestWithUser } from '@/guards/auth.guard'

/**
 * Injects the token payload that the `AuthGuard` attached to the request.
 *
 * @example
 * ```ts
 * async get(@CurrentUser() user: TokenPayload) {
 *   return this.getUserUseCase.execute(user.sub)
 * }
 * ```
 *
 * @remarks
 * Throws `500` when the payload is missing, which only happens on a route the
 * guard let through — a `@Public()` handler, or one reached before the guard
 * ran. That is a wiring mistake by the developer, not bad input from the
 * client, so it is deliberately not a `401`.
 *
 * The annotation on the parameter is **not** checked: parameter decorators
 * receive the position, never the type, so `@CurrentUser() user: number`
 * compiles and fails at runtime. Always annotate it as `TokenPayload`.
 **/
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
