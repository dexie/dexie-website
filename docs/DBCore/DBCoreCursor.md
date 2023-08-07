---
layout: docs
title: 'DBCoreCursor'
---

```ts
export interface DBCoreCursor {
  readonly trans: DBCoreTransaction;
  readonly key: any;
  readonly primaryKey: any;
  readonly value?: any;
  readonly done?: boolean;
  continue(key?: any): void;
  continuePrimaryKey(key: any, primaryKey: any): void;
  advance(count: number): void;
  start(onNext: ()=>void): Promise<any>
  stop(value?: any | Promise<any>): void;
  next(): Promise<DBCoreCursor>;
  fail(error: Error): void;
}
```

Represents a cursor. Represents a thin layer around [IDBCursor](https://developer.mozilla.org/en-US/docs/Web/API/IDBCursor). To be used by [DBCore](DBCore) middleware.

