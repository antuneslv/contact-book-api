import { SetMetadata } from '@nestjs/common'

/** Metadata key the `AuthGuard` reads to decide whether to skip a route. */
export const IS_PUBLIC_KEY = 'isPublic'

/**
 * Exempts a route or a whole controller from authentication.
 *
 * @remarks
 * The `AuthGuard` is registered globally via `APP_GUARD`, so **every** route is
 * protected until told otherwise. This decorator is the opt-out — the guard
 * reads the flag with `getAllAndOverride`, so placing it on a handler overrides
 * the controller.
 *
 * Deny-by-default is deliberate: forgetting the decorator leaves a route locked,
 * which is a visible bug. The opposite default leaks data silently.
 **/
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true)
