import * as ArrayFP from 'fp-ts/es6/Array';
import * as Either from 'fp-ts/es6/Either';
import { pipe } from 'fp-ts/es6/pipeable';

import { Guard, Func } from './types';

export type Funcify<T, R> = { [P in keyof T]: Func<T[P], R> };
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Guardify<T> = { [P in keyof T]: Guard<any, T[P]> };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function createFold<Types extends any[]>(...guards: Guardify<Types>) {
  type AllTypes = Types[number];

  function fold<R>(...funcs: Funcify<Types, R>): (s: AllTypes) => R;
  function fold<R, S extends AllTypes>(
    ...funcs: Funcify<
      {
        [key in keyof Types]: Extract<Types[key], S>;
      },
      R
    >
  ): (s: S) => R;
  function fold<R>(...funcs: Funcify<Types, R>) {
    return (s: AllTypes): R => {
      const guardsWithFuncs = ArrayFP.zip(guards, funcs);

      return pipe(
        guardsWithFuncs,
        ArrayFP.findFirst(([guard]) => guard(s)),
        Either.fromOption(() => new Error(`No guard found to fold ${s}`)),
        Either.fold(
          // if no guard found, we throw error, guards are broken
          (error) => {
            throw error;
          },
          // we found a guard, we return the result of the good function
          // applied to s
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          ([_, func]) => {
            return func(s);
          },
        ),
      );
    };
  }

  return fold;
}
