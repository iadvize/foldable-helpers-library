import { UnionToIntersection, Guard, GuardedType } from './types';

export function combineGuards<
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
