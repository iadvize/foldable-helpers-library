import { expectType } from 'tsd';

import { or, not, and } from '../src';

describe('not', () => {
  type TypeA = {
    a: string;
  };
  const isTypeA = (value: { a: unknown }): value is TypeA =>
    typeof value.a === 'string';

  type TypeB = {
    b: number;
  };
  const isTypeB = (value: { b: unknown }): value is TypeB =>
    typeof value.b === 'number';

  type TypeC = {
    a: 'test';
  };
  const isTypeC = (value: TypeA): value is TypeC => value.a === 'test';

  it('should exclude type N from type M', () => {
    const data = {
      a: 'toto',
      b: 1,
    };

    expect(isTypeA(data)).toBe(true);
    expect(isTypeB(data)).toBe(true);
    expect(isTypeC(data)).toBe(false);

    expect(not(isTypeA)(data)).toBe(false);
    expect(not(isTypeB)(data)).toBe(false);
    expect(not(isTypeC)(data)).toBe(true);

    expectType<
      (value: { a: unknown }) => value is Exclude<{ a: unknown }, TypeA>
    >(not(isTypeA));
  });

  it('should work well with and', () => {
    expect(and(isTypeA, isTypeB, not(isTypeC))({ a: 'toto', b: 1 })).toBe(true);
    expect(and(isTypeA, isTypeB, not(isTypeC))({ a: 'test', b: 1 })).toBe(
      false,
    );
    expect(and(isTypeA, not(isTypeB), isTypeC)({ a: 'test', b: null })).toBe(
      true,
    );
    expect(and(isTypeA, not(isTypeB), isTypeC)({ a: 'test', b: 'Hello' })).toBe(
      true,
    );
    expect(and(isTypeA, not(isTypeB), isTypeC)({ a: 'test', b: 1 })).toBe(
      false,
    );
  });
});

describe('or', () => {
  it('should create a new guard', () => {
    type TypeA = {
      a: string;
    };
    const isTypeA = (value: { a: unknown }): value is TypeA =>
      typeof value.a === 'string';

    type TypeB = {
      b: number;
    };
    const isTypeB = (value: { b: unknown }): value is TypeB =>
      typeof value.b === 'number';

    const isTypeAOrB = or(isTypeA, isTypeB);

    const data1 = {
      a: 'toto',
      b: 'fdahjl',
    };

    const data2 = {
      a: 2,
      b: 2,
    };

    expectType<
      (
        value: {
          a: unknown;
        } & {
          b: unknown;
        },
      ) => value is ({ a: unknown } & { b: unknown }) & (TypeA | TypeB)
    >(isTypeAOrB);

    expect(isTypeAOrB({ a: 2, b: 'fdsa' })).toBe(false);
    expect(isTypeAOrB(data1)).toBe(true);
    expect(isTypeAOrB(data2)).toBe(true);
  });

  it('should type correctly guards that have the same argument', () => {
    type A = 'A';
    type B = 'B';
    type C = 'C';
    type T = A | B | C;

    const isA = (t: T): t is A => t === 'A';
    const isB = (t: T): t is B => t === 'B';

    const isAOrB = or(isA, isB);

    expectType<(t: T) => t is A | B>(isAOrB);

    const isABis = (t: A): t is A => t === 'A';
    const isBBis = (t: B): t is B => t === 'B';

    const isAOrBBis = or(isABis, isBBis);

    expectType<(t: never) => t is never>(isAOrBBis);
  });
});

describe('and', () => {
  type Type1 = {
    tag1: true;
  };

  function isType1(t: { tag1: boolean }): t is Type1 {
    return t.tag1 === true;
  }

  type Type2 = {
    tag2: 10;
  };

  function isType2(t: { tag2: number }): t is Type2 {
    return t.tag2 === 10;
  }

  it('should return the combined new guard', () => {
    const combinedGuard = and(isType1, isType2);

    expectType<
      (
        t: {
          tag1: boolean;
        } & {
          tag2: number;
        },
      ) => t is {
        tag1: boolean;
      } & {
        tag2: number;
      } & Type1 &
        Type2
    >(combinedGuard);

    expect(combinedGuard({ tag1: true, tag2: 10 })).toEqual(true);
    expect(combinedGuard({ tag1: false, tag2: 10 })).toEqual(false);
    expect(combinedGuard({ tag1: true, tag2: 2 })).toEqual(false);
  });

  it('should type correctly guards that have the same argument', () => {
    type A = 'A';
    type B = 'B';
    type C = 'C';
    type T = A | B | C;

    const isA = (t: T): t is A => t === 'A';
    const isB = (t: T): t is B => t === 'B';

    const isAAndB = and(isA, isB);

    expectType<(t: T) => t is A & B>(isAAndB);
  });
});
