---
layout: docs
title: 'DeleteRequest'
---

```ts
export interface DeleteRequest {
  type: 'delete';
  trans: DBCoreTransaction;
  keys: Key[];
}
```
Input argument to [DBCoreTable](DBCoreTable).mutate(). See [DBCoreMutateRequest](DBCoreMutateRequest).
