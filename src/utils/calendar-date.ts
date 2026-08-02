/**
 * Reads a `YYYY-MM-DD` string as midnight **UTC**.
 *
 * @example
 * ```ts
 * parseCalendarDate('1990-01-20') // 1990-01-20T00:00:00.000Z
 * ```
 *
 * @remarks
 * A calendar date — a birthday, a due date — has no time and no time zone.
 * Building it from local time (`new Date('1990-01-20')` in some runtimes, or
 * `parse()` from date-fns) anchors it to the host offset, and the UTC day it
 * lands on shifts backwards for anyone east of Greenwich. Pinning the offset
 * keeps the stored day equal to the day that was typed, everywhere.
 *
 * Assumes the input already matches `YYYY-MM-DD`; a malformed string yields an
 * invalid `Date`. Validating the shape is the request DTO's job.
 *
 * @see {@link formatCalendarDate} for the way back.
 **/
export function parseCalendarDate(value: string): Date {
  return new Date(`${value}T00:00:00.000Z`)
}

/**
 * Renders a date as the `YYYY-MM-DD` calendar day it falls on in **UTC**.
 *
 * @example
 * ```ts
 * formatCalendarDate(new Date('1990-01-20T00:00:00.000Z')) // '1990-01-20'
 * ```
 *
 * @remarks
 * The mirror of {@link parseCalendarDate}, and the half that bites more often:
 * a date-only column comes back from the database at midnight UTC, so
 * formatting it in local time reports the *previous* day for anyone west of
 * Greenwich. Reading the UTC components sidesteps the offset entirely.
 **/
export function formatCalendarDate(value: Date): string {
  return value.toISOString().slice(0, 10)
}
