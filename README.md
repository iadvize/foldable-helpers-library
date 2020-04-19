@iadvize-oss/foldable-helpers
====================
![Continuous integration](https://github.com/iadvize/foldable-helpers-library/workflows/Continuous%20integration/badge.svg)

> Helpers to fold on things

While we recommend using `@iadvize-oss/foldable-helpers` with Typescript, it can
be used in standard Javascript apps.

# 💻 Usage 

First, install the library:

```bash
npm add @iadvize-oss/foldable-helpers
```

[📖 Documentation](https://iadvize.github.io/foldable-helpers-library/)

## Named fold - `createFoldObject`

You have a sum type and the type guards for each of the types. For example:

```ts
type T = A | B | C;

function isA(t: T): t is A { ... }
function isB(t: T): t is B { ... }
function isC(t: T): t is C { ... }
```

To create a named fold function to fold on `T`, use `createFoldObject`. You
choose the name of each fold function by passing an object.

```ts
import { pipe } from 'fp-ts/es6/pipeable';

import { createFoldObject } from '@iadvize-oss/foldable-helpers';

const foldOnT = createFoldObject({
  onA: isA,
  onB: isB,
  onC: isC
});

const t: T = ...;

pipe(
  t,
  foldOnT({
    onA: (tbis) => console.log('executed when t is A', { tbis }),
    onB: (tbis) => console.log('executed when t is B', { tbis }),
    onC: (tbis) => console.log('executed when t is C', { tbis }),
  }),
);
```

## Classic fold - `createFold`

You have a sum type and the type guards for each of the types. For example:

```ts
type T = A | B | C;

function isA(t: T): t is A { ... }
function isB(t: T): t is B { ... }
function isC(t: T): t is C { ... }
```

To create a fold function to fold on `T`, use `createFold`

```ts
import { pipe } from 'fp-ts/es6/pipeable';

import { createFold } from '@iadvize-oss/foldable-helpers';

const foldOnT = createFold(isA, isB, isC);

const t: T = ...;

pipe(
  t,
  foldOnT(
    (tbis) => console.log('executed when t is A', { tbis }),
    (tbis) => console.log('executed when t is B', { tbis }),
    (tbis) => console.log('executed when t is C', { tbis }),
  ),
);
```

Classic fold is very useful but could become hard to read when we have more than
3-4 types to fold on. You probably want to use `createFoldObject` in that case.


## `combineGuards`

When using fold you will probably encounter cases where a type is a combination
(union) of different guards. Oo reduce the boilerplate of having to write each
combination by hand you can use the `combineGuards` helper.

```ts
type A = { a: string };
type B = { b: number };

const isTypeA = (value: any): value is A =>
  value != null && typeof value.a === 'string';

const isTypeB = (value: any): value is B =>
  value != null && typeof value.b === 'number';

const oldIsTypeAAndB = (value: any): value is A & B =>
    isTypeA(value) && isTypeB(value);

const isTypeAAndB = combineGuards(isTypeA, isTypeB);
// (t: any): t is A & B => boolean
```

## `not`

When using createFold you **need to make sure that each guard mutually excludes
the others** but it can sometimes be painfull if one type depends on another,
therefore we let you use the `not` operator to exclude a guard

```ts
type TypeA = { a: string };
type TypeB = { a: 'test' };

const isTypeA = (value: {a: unknown}): value is TypeA => typeof value.a === 'string';
const isTypeB = (value: TypeA): value is TypeB => value.a === 'test';

const fold = createFoldObject({
  onTypeA: combineGuards(isTypeA, not(isTypeB)),
  onTypeB: isTypeB,
});
```
