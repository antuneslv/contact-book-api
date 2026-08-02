/**
 * Make some property optional on type
 *
 * @example
 * ```ts
 * type User {
 *  id: string;
 *  name: string;
 *  email: string;
 * }
 *
 * MakeOptional<User, 'name' | 'email'>
 * // { id: string; name?: string; email?: string }
 * ```
 **/
export type MakeOptional<T, K extends keyof T> = Omit<T, K> &
  Partial<Pick<T, K>>
