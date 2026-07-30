import { TokenService } from './token.service'

export class FakeTokenService implements TokenService {
  generate(payload: Record<string, unknown>): string {
    return `token-${JSON.stringify(payload)}`
  }

  verify(token: string): boolean {
    return token.startsWith('token-')
  }
}
