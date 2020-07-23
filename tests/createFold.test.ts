import { pipe } from 'fp-ts/es6/pipeable';
import { constant, identity } from 'fp-ts/es6/function';
import { map, range } from 'fp-ts/es6/Array';

import { createFold, or } from '../src';

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
        () => 'result2',
      ),
    );

    expect(result1).toEqual('result1');

    const type2: Type2 = { tag: 2 };
    const result2 = pipe(
      type2,
      fold(
        () => 'result1',
        () => 'result2',
      ),
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
      isType6,
    );

    const tags = range(1, 6);
    const funcs = pipe(tags, map(constant));

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const foldFunction = fold(...funcs);

    pipe(
      tags,
      map((t) => {
        const oneType = { tag: t };

        const result = pipe(oneType, foldFunction);

        expect(result).toEqual(t);
      }),
    );
  });

  it('created fold should throw if no guard found', () => {
    const fold = createFold(isType1, isType2);

    const tag = { tag: 3 };
    const someFunc = fold<{ tag: number }>(identity, identity);

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const funcThatWillThrow = () => someFunc(tag);

    expect(funcThatWillThrow).toThrowErrorMatchingSnapshot();
  });

  it('created fold accept refined type', () => {
    type A1 = 'A1';
    type A2 = 'A2';

    type B1 = 'B1';
    type B2 = 'B2';

    type A = A1 | A2;
    type B = B1 | B2;

    type T1 = A1 | B1;

    type T = A | B;

    const isA1 = (t: T): t is A1 => t === 'A1';
    const isA2 = (t: T): t is A2 => t === 'A2';
    const isB1 = (t: T): t is B1 => t === 'B1';
    const isB2 = (t: T): t is B2 => t === 'B2';

    const isA = or(isA1, isA2);
    const isB = or(isB1, isB2);

    const is1 = or(isA1, isB1);
    const is2 = or(isA2, isB2);

    const fold12 = createFold(is1, is2);

    const foldAB = createFold(isA, isB);

    const functionThatTakesOnlyA1 = (t: A1) => t;
    const t = 'A1' as T;

    const result = pipe(
      t,
      fold12(
        (t1) =>
          pipe(
            t1,
            foldAB<string, T1>(
              (a) => functionThatTakesOnlyA1(a),
              () => 'b',
            ),
          ),
        () => 't2',
      ),
    );

    expect(result).toEqual('A1');
  });
});
