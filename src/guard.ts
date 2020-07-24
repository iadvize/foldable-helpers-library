import { Guard } from './types';

type NotGuard<A, B extends A> = (a: A) => a is Exclude<A, B>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type GuardedType<T> = T extends (x: any) => x is infer T ? T : never;

/**
 * Takes an array of guard parameters (so should have only one item)
 * and return the first parameter converted to an intersection.
 *
 * @example
  type Guards = ... // some guards

  type GuardsParameters = Parameters\<Guards[number]\>;
  type IntersectionOfInputTypes = InputParametersToIntersection<GuardsParameters>;
 *
 */
type InputParametersToIntersection<Params> = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Params extends [any]
    ? (k: Params[0]) => void
    : never
) extends (k: infer I) => void
  ? I
  : never;

export function not<A, B extends A>(guard: Guard<A, B>): NotGuard<A, B> {
  return (value: A): value is Exclude<A, B> => !guard(value);
}

export function and<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Guards extends Guard<any, any>[]
>(...guards: Guards) {
  type GuardsParameters = Parameters<Guards[number]>;
  type IntersectionOfInputTypes = InputParametersToIntersection<
    GuardsParameters
  >;

  type OuputTypes = GuardedType<Guards[number]>;

  type UnionToIntersection<U> = (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    U extends any
      ? (k: U) => void
      : never
  ) extends (k: infer I) => void
    ? I
    : never;

  type IntersectionOfOutputTypes = UnionToIntersection<OuputTypes>;

  return (
    t: IntersectionOfInputTypes,
  ): t is IntersectionOfInputTypes & IntersectionOfOutputTypes => {
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
  type GuardsParameters = Parameters<Guards[number]>;

  type IntersectionOfInputTypes = InputParametersToIntersection<
    GuardsParameters
  >;

  type OuputTypes = GuardedType<Guards[number]>;

  return (
    t: IntersectionOfInputTypes,
  ): t is IntersectionOfInputTypes & OuputTypes => {
    return guards.some((guard: Guard<unknown, unknown>) => guard(t));
  };
}
