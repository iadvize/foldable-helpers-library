import { not, combineGuards } from '../src';

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

  it('should work well with combineGuards', () => {
    expect(
      combineGuards(isTypeA, isTypeB, not(isTypeC))({ a: 'toto', b: 1 })
    ).toBe(true);
    expect(
      combineGuards(isTypeA, isTypeB, not(isTypeC))({ a: 'test', b: 1 })
    ).toBe(false);
    expect(
      combineGuards(isTypeA, not(isTypeB), isTypeC)({ a: 'test', b: null })
    ).toBe(true);
    expect(
      combineGuards(isTypeA, not(isTypeB), isTypeC)({ a: 'test', b: 'Hello' })
    ).toBe(true);
    expect(
      combineGuards(isTypeA, not(isTypeB), isTypeC)({ a: 'test', b: 1 })
    ).toBe(false);
  });
});
