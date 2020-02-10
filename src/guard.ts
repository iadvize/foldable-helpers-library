import { Guard, NotGuard } from './types';

export const not = <A, B extends A>(guard: Guard<A, B>): NotGuard<A, B> => (
  value: A
): value is Exclude<A, B> => !guard(value);
