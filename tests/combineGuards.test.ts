import { combineGuards } from '../src';

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

describe('combineGuards', () => {
  it('should create a new guard returning true when all sub guards return true', () => {
    const combinedGuard = combineGuards(isType1, isType2);

    expect(combinedGuard({ tag1: true, tag2: 10 })).toEqual(true);
  });

  it('should create a new guard returning false when one of sub guards return false', () => {
    const combinedGuard = combineGuards(isType1, isType2);

    expect(combinedGuard({ tag1: false, tag2: 10 })).toEqual(false);
    expect(combinedGuard({ tag1: true, tag2: 2 })).toEqual(false);
  });
});
