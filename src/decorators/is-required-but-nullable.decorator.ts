import { applyDecorators } from '@nestjs/common'
import { IsDefined, ValidateIf } from 'class-validator'

/**
 * Requires the field to be present in the payload, but accepts `null` as its
 * value. The mirror of `IsOptionalButNotNull`.
 *
 * | | `undefined` | `null` |
 * | --- | --- | --- |
 * | `@IsOptionalButNotNull()` | passes | rejects |
 * | `@IsRequiredButNullable()` | rejects | passes |
 *
 * @remarks
 * Meant for `PUT`, where the body is the whole resource: a field left out would
 * silently wipe the stored value, and a `200` on accidental data loss is worse
 * than a `400` telling the client the payload is incomplete. Requiring it costs
 * the client nothing, since any `GET` already hands back every field.
 *
 * `class-validator` has no single decorator for this. `ValidateIf` skips *all*
 * validators on the property when it returns false — so a `null` short-circuits
 * the rest, including `IsDefined`, and the only case left for `IsDefined` to
 * catch is the `undefined` we want to reject.
 *
 * Pair it with `@ApiProperty({ nullable: true })` and **not**
 * `@ApiPropertyOptional()`: the field is required in the request, only its
 * value is nullable.
 **/
export const IsRequiredButNullable = () =>
  applyDecorators(
    ValidateIf((_, value) => value !== null),
    IsDefined(),
  )
