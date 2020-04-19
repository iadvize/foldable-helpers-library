/* eslint-disable @typescript-eslint/no-explicit-any */
import * as ArrayFP from 'fp-ts/es6/Array';
import * as Either from 'fp-ts/es6/Either';
import * as RecordFP from 'fp-ts/es6/Record';
import { pipe } from 'fp-ts/es6/pipeable';
import { identity } from 'fp-ts/es6/function';

import { Guard, Func } from './types';

const DEFAULT_CLAUSE = '_';

type Guards<TypesRecord extends Record<string, any>> = {
  [key in keyof TypesRecord]: Guard<any, TypesRecord[key]>;
};

export function createFoldObject<TypesRecord extends Record<string, any>>(
  guards: Guards<TypesRecord>,
) {
  type FullFoldFunctions<R> = {
    [key in keyof TypesRecord]: Func<TypesRecord[key], R>;
  };

  type PartialFoldFunctions<R> = Partial<FullFoldFunctions<R>>;

  type OmittedTypesRecord<R> = Omit<TypesRecord, keyof PartialFoldFunctions<R>>;

  type OmittedTypesInstance<R> = OmittedTypesRecord<R>[keyof OmittedTypesRecord<
    R
  >];

  type PartialFoldFunctionsWithDefault<R> = PartialFoldFunctions<R> & {
    _: Func<OmittedTypesInstance<R>, R>;
  };

  type FoldFunctions<R> =
    | PartialFoldFunctionsWithDefault<R>
    | FullFoldFunctions<R>;

  type Instance = TypesRecord[keyof TypesRecord & string];

  return function fold<R>(funcs: FoldFunctions<R>) {
    return (s: Instance): R => {
      const keys = RecordFP.keys(guards);

      return pipe(
        keys,
        ArrayFP.findFirst(key => guards[key](s)),
        Either.fromOption(() => new Error(`No guard found to fold ${s}`)),
        Either.chain(key => {
          if (key in funcs) {
            const func = funcs[key];

            if (typeof func !== 'function') {
              return Either.left(
                new Error(`"${key}" clause should be a function`),
              );
            }

            return Either.right(func(s));
          }

          if (DEFAULT_CLAUSE in funcs) {
            const func = funcs[DEFAULT_CLAUSE];

            if (typeof func !== 'function') {
              return Either.left(
                new Error(`"${DEFAULT_CLAUSE}" clause should be a function`),
              );
            }

            // s is not refined magically by TS so we have to force the type
            const localS = s as OmittedTypesInstance<R>;

            return Either.right(func(localS));
          }

          return Either.left(
            new Error(`No "${key}" nor "_" clause passed to fold`),
          );
        }),
        Either.fold(
          // if no function found, we throw error, guards or fold clauses are
          // broken
          error => {
            throw error;
          },
          // we found a function, we return the result of the function applied
          // to the given instance
          identity,
        ),
      );
    };
  };
}
