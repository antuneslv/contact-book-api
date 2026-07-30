export abstract class TokenService {
  abstract generate(payload: Record<string, unknown>): string
  abstract verify(token: string): boolean
}
