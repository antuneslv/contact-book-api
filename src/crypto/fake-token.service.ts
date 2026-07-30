import { TokenPayload, TokenService } from './token.service'

export class FakeTokenService implements TokenService {
  private static readonly PREFIX = 'token-'

  generate(payload: TokenPayload): string {
    return `${FakeTokenService.PREFIX}${JSON.stringify(payload)}`
  }

  verify(token: string): TokenPayload | null {
    if (!token.startsWith(FakeTokenService.PREFIX)) return null

    try {
      return JSON.parse(
        token.slice(FakeTokenService.PREFIX.length),
      ) as TokenPayload
    } catch {
      return null
    }
  }
}
