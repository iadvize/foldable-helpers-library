export type Guard<A, B extends A> = (a: A) => a is B;

export type Func<S, R> = (s: S) => R;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Guardify<T> = { [P in keyof T]: Guard<any, T[P]> };
export type Funcify<T, R> = { [P in keyof T]: Func<T[P], R> };
