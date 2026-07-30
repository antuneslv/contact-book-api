export type TokenPayload = { sub: string }

export abstract class TokenService {
  abstract generate(payload: TokenPayload): string
  abstract verify(token: string): TokenPayload | null
}
