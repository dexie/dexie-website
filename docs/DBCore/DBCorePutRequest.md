---
layout: docs
title: 'DBCorePutRequest'
---

```ts
export interface DBCorePutRequest {
  type: 'put';
  trans: DBCoreTransaction;
  values: any[];
  keys?: any[];
  wantResults?: boolean;
}
```
Input argument to [DBCoreTable](DBCoreTable).mutate(). See [DBCoreMutateRequest](DBCoreMutateRequest).
