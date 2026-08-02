import { ValidateIf } from 'class-validator'

/**
 * Marks a field as optional while still rejecting `null`.
 *
 * @remarks
 * `@IsOptional()` skips validation for `undefined` **and** `null`, which is
 * wrong for `PATCH`: there `undefined` means "leave this field alone" and
 * `null` has no meaning, so accepting it lets a client wipe a column by
 * accident. Skipping only on `undefined` keeps `null` flowing to the
 * validators, which reject it.
 *
 * Use it on `PATCH` payloads. On `PUT` prefer plain `@IsOptional()` — the body
 * is the whole resource there, so an absent field and `null` genuinely mean the
 * same thing.
 *
 * Being optional also takes `@ApiPropertyOptional()` and a `?` on the property.
 * The `?` is the only one the compiler sees.
 **/
export const IsOptionalButNotNull = () =>
  ValidateIf((_, value) => value !== undefined)
