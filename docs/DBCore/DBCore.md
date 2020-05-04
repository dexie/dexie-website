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
  readonly MIN_KEY: Key;
  readonly MAX_KEY: Key;
  readonly schema: DBCoreSchema;
  table(name: string): DBCoreTable<TQuery>;
}
```

See [Dexie.use()](../Dexie/Dexie.use())

See also:
* [DBCoreTransactionRequest](DBCoreTransactionRequest)
* [DBCoreTransaction](DBCoreTransaction)
* [DBCoreSchema](DBCoreSchema)
* [DBCoreTable](DBCoreTable)
* [DBCoreQuery](DBCoreQuery)
