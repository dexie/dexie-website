---
layout: docs
title: 'DBCoreDeleteRequest'
---

```ts
export interface DBCoreDeleteRequest {
  type: 'delete';
  trans: DBCoreTransaction;
  keys: any[];
}
```
Input argument to [DBCoreTable](DBCoreTable).mutate(). See [DBCoreMutateRequest](DBCoreMutateRequest).
