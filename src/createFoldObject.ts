import { findFirst } from 'fp-ts/es6/Array';
import { fromOption, fold } from 'fp-ts/es6/Either';
import { pipe } from 'fp-ts/es6/pipeable';

import { Guard, Func } from './types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function createFoldObject<TypesRecord extends Record<string, any>>(
  guards: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key in keyof TypesRecord]: Guard<any, TypesRecord[key]>;
  },
) {
  return function <R>(
    funcs: {
      [key in keyof TypesRecord]: Func<TypesRecord[key], R>;
    },
  ) {
    // need & string here to filter number and symbol
    type Names = keyof TypesRecord & string;

    type AllTypes = TypesRecord[Names];

    return (s: AllTypes): R => {
      const keys = Object.keys(guards);

      return pipe(
        keys,
        findFirst((key) => guards[key](s)),
        fromOption(() => new Error(`No guard found to fold ${s}`)),
        fold(
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
  };
}
