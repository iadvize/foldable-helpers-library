import { not, or, and } from '../src/guard';
import { createFold } from '../src/createFold';
import { createFoldObject } from '../src/createFoldObject';

import * as indexExport from '../src';

describe('index', () => {
  it('should export createFold', () => {
    expect(indexExport).toEqual({
      not,
      createFold,
      createFoldObject,
      or,
      and,
    });
  });
});
