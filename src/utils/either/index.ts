export class Left<L, R> {
  readonly value: L

  constructor(value: L) {
    this.value = value
  }

  isRight(): this is Right<L, R> {
    return false
  }

  isLeft(): this is Left<L, R> {
    return true
  }
}

export class Right<L, R> {
  readonly value: R

  constructor(value: R) {
    this.value = value
  }

  isRight(): this is Right<L, R> {
    return true
  }

  isLeft(): this is Left<L, R> {
    return false
  }
}

export type Either<L, R> = Left<L, R> | Right<L, R>

/**
 * Creates a Left value representing a failure or error state.
 * @template L The type of the left value.
 * @param value The value to wrap in a Left instance.
 * @returns An Either instance containing the provided value on the left side.
 */
export function left<L>(value: L): Either<L, never> {
  return new Left(value)
}

/**
 * Creates a Right value representing a success state.
 * @template R The type of the right value.
 * @param value The value to wrap in a Right instance.
 * @returns An Either instance containing the provided value on the right side.
 */
export function right<R>(value: R): Either<never, R> {
  return new Right(value)
}
