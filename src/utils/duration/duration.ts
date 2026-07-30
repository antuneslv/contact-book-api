const TIME_UNITS = ['s', 'm', 'h', 'd'] as const

type TimeUnit = (typeof TIME_UNITS)[number]

/**
 * Time span written as a positive integer followed by a unit, used by
 * configuration values such as `JWT_EXPIRES_IN` in the `.env` file.
 *
 * Supported units:
 *
 * | Unit | Meaning |
 * | ---- | ------- |
 * | `s`  | seconds |
 * | `m`  | minutes |
 * | `h`  | hours   |
 * | `d`  | days    |
 *
 * @example
 * ```dotenv
 * JWT_EXPIRES_IN=30s   # 30 seconds
 * JWT_EXPIRES_IN=15m   # 15 minutes
 * JWT_EXPIRES_IN=2h    # 2 hours
 * JWT_EXPIRES_IN=7d    # 7 days
 * ```
 *
 * @remarks
 * The following are rejected by {@link isDuration}: zero (`0m`), decimals
 * (`1.5h`), negative values (`-5m`), spaces (`2 days`), spelled-out units
 * (`30min`), uppercase units (`30M`) and unsupported units (`30ms`, `30w`).
 *
 * Note that the type alone is looser than the guard — `'0m'` satisfies the
 * template literal but fails at runtime — so always validate incoming
 * strings with {@link isDuration} instead of casting.
 */
export type Duration = `${number}${TimeUnit}`

const DURATION_PATTERN = new RegExp(
  String.raw`^[1-9]\d*(${TIME_UNITS.join('|')})$`,
)

/**
 * Type guard that narrows a string to {@link Duration}.
 *
 * Meant for validating configuration at startup: pair it with a schema
 * refinement so an invalid value aborts the boot instead of blowing up later,
 * when the value is first used.
 *
 * @param value - Raw string, typically read from an environment variable.
 * @returns `true` when `value` is a positive integer followed by `s`, `m`,
 * `h` or `d`.
 *
 * @example
 * ```ts
 * isDuration('30m') // true
 * isDuration('30 minutes') // false
 *
 * JWT_EXPIRES_IN: z.string().refine(isDuration, {
 *   message: 'JWT_EXPIRES_IN must be a value like 30s, 15m, 2h or 7d',
 * }),
 * ```
 */
export function isDuration(value: string): value is Duration {
  return DURATION_PATTERN.test(value)
}
