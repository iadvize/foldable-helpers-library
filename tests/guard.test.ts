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

describe('of', () => {
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

  it('should create a new guard', () => {
    const isTypeAOrB = or(isTypeA, isTypeB);

    const data1 = {
      a: 'toto',
      b: 'fdahjl',
    };

    const data2 = {
      a: 2,
      b: 2,
    };

    expect(isTypeAOrB({ a: 2, b: 'fdsa' })).toBe(false);
    expect(isTypeAOrB(data1)).toBe(true);
    expect(isTypeAOrB(data2)).toBe(true);
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
  it('should create a new guard returning true when all sub guards return true', () => {
    const combinedGuard = and(isType1, isType2);

    expect(combinedGuard({ tag1: true, tag2: 10 })).toEqual(true);
  });

  it('should create a new guard returning false when one of sub guards return false', () => {
    const combinedGuard = and(isType1, isType2);

    expect(combinedGuard({ tag1: false, tag2: 10 })).toEqual(false);
    expect(combinedGuard({ tag1: true, tag2: 2 })).toEqual(false);
  });
});
