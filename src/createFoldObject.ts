import * as ArrayFP from 'fp-ts/es6/Array';
import * as Either from 'fp-ts/es6/Either';
import { pipe } from 'fp-ts/es6/pipeable';

import { Guard, Func } from './types';

export function createFoldObject<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TypesRecord extends Record<string | number | symbol, any>
>(
  guards: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key in keyof TypesRecord]: Guard<any, TypesRecord[key]>;
  },
) {
  type Names = keyof TypesRecord;

  type AllTypes = TypesRecord[Names];

  function fold<R>(
    funcs: {
      [key in keyof TypesRecord]: Func<TypesRecord[key], R>;
    },
  ): (s: AllTypes) => R;
  function fold<R, S extends AllTypes>(
    funcs: {
      [key in keyof TypesRecord]: Func<Extract<S, TypesRecord[key]>, R>;
    },
  ): (s: S) => R;
  function fold<R>(
    funcs: {
      [key in keyof TypesRecord]: Func<TypesRecord[key], R>;
    },
  ) {
    return (s: AllTypes): R => {
      const keys = Object.keys(guards) as Names[];

      return pipe(
        keys,
        ArrayFP.findFirst((key) => guards[key](s)),
        Either.fromOption(() => new Error(`No guard found to fold ${s}`)),
        Either.fold(
          // if no key found, we throw error, guards are broken
          (error) => {
            throw error;
          },
          // we found a key, we return the result of the good function
          // applied to s
          (key) => {
            return funcs[key](s);
          },
        ),
      );
    };
  }

  return fold;
}
