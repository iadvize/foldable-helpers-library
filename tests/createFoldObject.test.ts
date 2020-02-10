import { pipe } from 'fp-ts/es6/pipeable';
import { identity } from 'fp-ts/es6/function';
import { map, range } from 'fp-ts/es6/Array';

import { createFoldObject } from '../src';

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

describe('createFoldObject', () => {
  it('created fold should call the corresponding function for 2 types', () => {
    const fold = createFoldObject({
      type1: isType1,
      type2: isType2,
    });

    const type1: Type1 = { tag: 1 };
    const result1 = pipe(
      type1,
      fold({
        type1: () => 'result1',
        type2: () => 'result2',
      })
    );

    expect(result1).toEqual('result1');

    const type2: Type2 = { tag: 2 };
    const result2 = pipe(
      type2,
      fold({
        type1: () => 'result1',
        type2: () => 'result2',
      })
    );

    expect(result2).toEqual('result2');
  });

  it('created fold should call the corresponding function for 6 types', () => {
    const fold = createFoldObject({
      type1: isType1,
      type2: isType2,
      type3: isType3,
      type4: isType4,
      type5: isType5,
      type6: isType6,
    });

    const foldFunction = fold({
      type1: () => 'result1',
      type2: () => 'result2',
      type3: () => 'result3',
      type4: () => 'result4',
      type5: () => 'result5',
      type6: () => 'result6',
    });

    const tags = range(1, 6) as (1 | 2 | 3 | 4 | 5 | 6)[];

    pipe(
      tags,
      map(t => {
        const oneType = { tag: t };

        const result = pipe(oneType, foldFunction);

        expect(result).toEqual(`result${t}`);
      })
    );
  });

  it('created fold should throw if no guard found', () => {
    const fold = createFoldObject({
      type1: isType1,
      type2: isType2,
    });

    const tag = { tag: 3 };
    const someFunc = fold<{ tag: number }>({
      type1: identity,
      type2: identity,
    });

    // @ts-ignore
    const funcThatWillThrow = () => someFunc(tag);

    expect(funcThatWillThrow).toThrow();
  });
});
