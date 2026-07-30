import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'

import { EnvService } from '@/env/env.service'

import { TokenService } from './token.service'

@Injectable()
export class JwtTokenService implements TokenService {
  private readonly secret: string
  private readonly EXPIRES_IN = '30m'

  constructor(
    private readonly jwtService: JwtService,
    private readonly envService: EnvService,
  ) {
    this.secret = this.envService.get('JWT_SECRET')
  }

  generate(payload: Record<string, unknown>): string {
    return this.jwtService.sign(payload, {
      secret: this.secret,
      expiresIn: this.EXPIRES_IN,
    })
  }

  verify(token: string): boolean {
    try {
      this.jwtService.verify(token, { secret: this.secret })
      return true
    } catch {
      return false
    }
  }
}
