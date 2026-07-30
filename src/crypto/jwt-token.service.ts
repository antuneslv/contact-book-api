import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'

import { TokenPayload, TokenService } from './token.service'

@Injectable()
export class JwtTokenService implements TokenService {
  constructor(private readonly jwtService: JwtService) {}

  generate(payload: TokenPayload): string {
    return this.jwtService.sign(payload)
  }

  verify(token: string): TokenPayload | null {
    try {
      return this.jwtService.verify<TokenPayload>(token)
    } catch {
      return null
    }
  }
}
