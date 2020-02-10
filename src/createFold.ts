import { zip, findFirst } from 'fp-ts/es6/Array';
import { fromOption, fold } from 'fp-ts/es6/Either';
import { pipe } from 'fp-ts/es6/pipeable';

import { Funcify, Guardify } from './types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function createFold<Types extends any[]>(...guards: Guardify<Types>) {
  return function<R>(...funcs: Funcify<Types, R>) {
    type AllTypes = Types[number];

    return (s: AllTypes): R => {
      const guardsWithFuncs = zip(guards, funcs);

      return pipe(
        guardsWithFuncs,
        findFirst(([guard]) => guard(s)),
        fromOption(() => new Error(`No guard found to fold ${s}`)),
        fold(
          // if no guard found, we throw error, guards are broken
          error => {
            throw error;
          },
          // we found a guard, we return the result of the good function
          // applied to s
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          ([_, func]) => {
            return func(s);
          }
        )
      );
    };
  };
}
