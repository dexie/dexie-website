---
layout: docs
title: 'DBCoreCursor'
---

```ts
export interface DBCoreCursor<TResult=any> {
  readonly trans: DBCoreTransaction;
  readonly key: Key;
  readonly primaryKey: Key;
  readonly value?: any;
  readonly done?: boolean;
  continue(key?: any): void;
  continuePrimaryKey(key: Key, primaryKey: Key): void;
  advance(count: number): void;
  start(onNext: ()=>void): Promise<TResult>
  stop(value?: TResult | Promise<TResult>): void;
  next(): Promise<DBCoreCursor>;
  fail(error: Error): void;
}
```

Represents a cursor. Represents a thin layer around [IDBCursor](https://developer.mozilla.org/en-US/docs/Web/API/IDBCursor). To be used by [DBCore](DBCore) middlewares.

