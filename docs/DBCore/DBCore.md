---
layout: docs
title: 'DBCore'
---

```ts
export interface DBCore<TQuery=DBCoreQuery> {
  stack: "dbcore";
  // Transaction and Object Store
  transaction(req: DBCoreTransactionRequest): DBCoreTransaction;

  // Utility methods
  cmp(a: any, b: any) : number;
  //rangeIncludes(range: KeyRange): (key: Key) => boolean;
  //comparer(table: string, index: string | null): (a: any, b: any) => number;
  //readonly schema: DBCoreSchema;
  readonly MIN_KEY: Key;
  readonly MAX_KEY: Key;
  readonly schema: DBCoreSchema;
  table(name: string): DBCoreTable<TQuery>;
}
```
