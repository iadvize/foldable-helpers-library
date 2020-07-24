export type Guard<A, B extends A> = (a: A) => a is B;

export type Func<S, R> = (s: S) => R;
