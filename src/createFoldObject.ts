/* eslint-disable @typescript-eslint/no-explicit-any */
import * as ArrayFP from 'fp-ts/es6/Array';
import * as Either from 'fp-ts/es6/Either';
import { pipe } from 'fp-ts/es6/pipeable';

import { Guard, Func } from './types';

type Guards<TypesRecord extends Record<string, any>> = {
  [key in keyof TypesRecord]: Guard<any, TypesRecord[key]>;
};

export function createFoldObject<TypesRecord extends Record<string, any>>(
  guards: Guards<TypesRecord>,
) {
  type FoldFunctions<TypesRecord extends Record<string, any>, R> = {
    [key in keyof TypesRecord]: Func<TypesRecord[key], R>;
  };

  type Instance<
    TypesRecord extends Record<string, any>
  > = TypesRecord[keyof TypesRecord & string];

  return function fold<R>(funcs: FoldFunctions<TypesRecord, R>) {
    return (s: Instance<TypesRecord>): R => {
      const keys = Object.keys(guards);

      return pipe(
        keys,
        ArrayFP.findFirst(key => guards[key](s)),
        Either.fromOption(() => new Error(`No guard found to fold ${s}`)),
        Either.fold(
          // if no key found, we throw error, guards are broken
          error => {
            throw error;
          },
          // we found a key, we return the result of the good function
          // applied to s
          key => {
            return funcs[key](s);
          },
        ),
      );
    };
  };
}
