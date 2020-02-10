export type Guard<A, B extends A> = (a: A) => a is B;
export type NotGuard<A, B extends A> = (a: A) => a is Exclude<A, B>;

export type Func<S, R> = (s: S) => R;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Guardify<T> = { [P in keyof T]: Guard<any, T[P]> };
export type Funcify<T, R> = { [P in keyof T]: Func<T[P], R> };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type GuardedType<T> = T extends (x: any) => x is infer T ? T : never;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type UnionToIntersection<U> = (U extends any
? (k: U) => void
: never) extends (k: infer I) => void
  ? I
  : never;
