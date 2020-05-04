---
layout: docs
title: 'DBCoreGetManyRequest'
---

```ts
export interface DBCoreGetManyRequest {
  trans: DBCoreTransaction;
  keys: Key[];
}
```
Used as input parameter to [DBCoreTable](DBCoreTable).getMany()
