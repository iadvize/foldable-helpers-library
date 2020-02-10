import { not } from '../src/guard';
import { combineGuards } from '../src/combineGuards';
import { createFold } from '../src/createFold';
import { createFoldObject } from '../src/createFoldObject';

import * as indexExport from '../src';

describe('index', () => {
  it('should export createFold', () => {
    expect(indexExport).toEqual({
      not,
      createFold,
      createFoldObject,
      combineGuards,
    });
  });
});
