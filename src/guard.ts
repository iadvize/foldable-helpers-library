import { Guard, NotGuard, UnionToIntersection, GuardedType } from './types';

export function not<A, B extends A>(guard: Guard<A, B>): NotGuard<A, B> {
  return (value: A): value is Exclude<A, B> => !guard(value);
}

export function and<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Guards extends Guard<any, any>[]
>(...guards: Guards) {
  type InputTypes = Parameters<Guards[number]>[0];
  type IntersectionOfInputTypes = UnionToIntersection<InputTypes>;

  type OuputTypes = GuardedType<Guards[number]>;
  type IntersectionOfOutputTypes = UnionToIntersection<OuputTypes>;

  return (t: IntersectionOfInputTypes): t is IntersectionOfOutputTypes => {
    return guards.reduce(
      (acc: boolean, guard: Guard<unknown, unknown>) => acc && guard(t),
      true,
    );
  };
}

export function or<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Guards extends Guard<any, any>[]
>(...guards: Guards) {
  type InputTypes = Parameters<Guards[number]>[0];
  type IntersectionOfInputTypes = UnionToIntersection<InputTypes>;

  type OuputTypes = GuardedType<Guards[number]>;

  return (
    t: IntersectionOfInputTypes,
  ): t is IntersectionOfInputTypes & OuputTypes => {
    return guards.some((guard: Guard<unknown, unknown>) => guard(t));
  };
}
