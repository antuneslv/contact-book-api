import { Transform } from 'class-transformer'

/**
 * Strips surrounding whitespace from a string field before validation runs.
 *
 * @remarks
 * Declare it above the validators so `@IsNotEmpty()` sees the trimmed value —
 * otherwise a field containing only spaces passes as filled. Non-string values
 * pass through untouched, leaving type errors for the validators to report.
 **/
export const Trim = () =>
  Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
