import { pipe } from 'fp-ts/es6/pipeable';
import { constant, identity } from 'fp-ts/es6/function';
import { map, range } from 'fp-ts/es6/Array';

import { createFold } from '../src';

type Type<Tag> = {
  tag: Tag;
};

function createIsType<Tag>(tag: Tag) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return function isType(t: { tag: any }): t is Type<Tag> {
    return t.tag === tag;
  };
}

type Type1 = Type<1>;
type Type2 = Type<2>;

const isType1 = createIsType(1 as const);
const isType2 = createIsType(2 as const);
const isType3 = createIsType(3 as const);
const isType4 = createIsType(4 as const);
const isType5 = createIsType(5 as const);
const isType6 = createIsType(6 as const);

describe('createFold', () => {
  it('created fold should call the corresponding function for 2 types', () => {
    const fold = createFold(isType1, isType2);

    const type1: Type1 = { tag: 1 };
    const result1 = pipe(
      type1,
      fold(
        () => 'result1',
        () => 'result2'
      )
    );

    expect(result1).toEqual('result1');

    const type2: Type2 = { tag: 2 };
    const result2 = pipe(
      type2,
      fold(
        () => 'result1',
        () => 'result2'
      )
    );

    expect(result2).toEqual('result2');
  });

  it('created fold should call the corresponding function for 6 types', () => {
    const fold = createFold(
      isType1,
      isType2,
      isType3,
      isType4,
      isType5,
      isType6
    );

    const tags = range(1, 6);
    const funcs = pipe(tags, map(constant));

    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    const foldFunction = fold(...funcs);

    pipe(
      tags,
      map(t => {
        const oneType = { tag: t };

        const result = pipe(oneType, foldFunction);

        expect(result).toEqual(t);
      })
    );
  });

  it('created fold should throw if no guard found', () => {
    const fold = createFold(
      isType1,
      isType2,
    );

    const tag = { tag: 3 };
    const someFunc = fold<{ tag: number }>(
      identity,
      identity,
    );

    // @ts-ignore
    const funcThatWillThrow = () => someFunc(tag);

    expect(funcThatWillThrow).toThrow();
  });
});
