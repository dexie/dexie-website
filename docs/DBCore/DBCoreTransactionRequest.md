---
layout: docs
title: 'DBCoreTransactionRequest'
---

```ts
export interface DBCoreTransactionRequest {
  tables: string[];
  mode: DBCoreTransactionMode;
}
```
Input argument to [DBCore](DBCore).transaction().
