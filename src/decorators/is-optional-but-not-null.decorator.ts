import { ValidateIf } from 'class-validator'

export const IsOptionalButNotNull = () =>
  ValidateIf((_, value) => value !== undefined)
