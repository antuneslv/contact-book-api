import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { Request } from 'express'

import { TokenPayload, TokenService } from '@/crypto/token.service'
import { IS_PUBLIC_KEY } from '@/decorators/public.decorator'

export type RequestWithUser = Request & { user?: TokenPayload }

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly tokenService: TokenService,
  ) {}

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ])

    if (isPublic) return true

    const request = context.switchToHttp().getRequest<RequestWithUser>()
    const authorization = request.headers.authorization

    if (!authorization) {
      throw new UnauthorizedException('Missing authorization header')
    }

    const [scheme, token] = authorization.split(/\s+/)

    if (scheme !== 'Bearer' || !token) {
      throw new UnauthorizedException('Invalid authorization format')
    }

    const payload = this.tokenService.verify(token)

    if (!payload) {
      throw new UnauthorizedException('Invalid token')
    }

    request.user = payload

    return true
  }
}
