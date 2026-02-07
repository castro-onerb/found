export type Either<L, R> = Left<L, R> | Right<R, L>;

export class Left<L, R = never> {
  private readonly _value: L;

  constructor(value: L) {
    this._value = value;
  }

  isLeft(): this is Left<L, R> {
    return true;
  }

  isRight(): this is Left<L, R> {
    return false;
  }

  map<T>(_fn: (v: R) => T): Left<L, T> {
    return new Left<L, T>(this._value);
  }

  mapLeft<T>(fn: (l: L) => T): Left<T, R> {
    return new Left<T, R>(fn(this._value));
  }

  fold<T>(fl: (l: L) => T, _fr: (r: R) => R): T {
    return fl(this._value);
  }
}

export class Right<R, L = never> {
  private readonly _value: R;

  constructor(value: R) {
    this._value = value;
  }

  isLeft(): this is Right<R, L> {
    return false;
  }

  isRight(): this is Right<R, L> {
    return true;
  }

  map<T>(fn: (v: R) => T): Right<T, L> {
    return new Right<T, L>(fn(this._value));
  }

  mapLeft<T>(_fn: (l: L) => T): Right<R, T> {
    return new Right<R, T>(this._value);
  }

  fold<T>(_fl: (l: L) => L, fr: (r: R) => T): T {
    return fr(this._value);
  }
}

export const left = <L, R = never>(l: L) =>
  new Left<L, R>(l);

export const right = <R, L = never>(r: R) =>
  new Right<R, L>(r);
