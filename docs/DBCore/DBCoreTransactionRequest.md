---
layout: docs
title: 'DBCoreTransactionRequest'
---

```ts
export interface DBCoreTransactionRequest {
  tables: string[];
  mode: 'readonly' | 'readwrite';
}
```
Input argument to [DBCore](DBCore).transaction().

