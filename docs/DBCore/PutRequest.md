---
layout: docs
title: 'PutRequest'
---

```ts
export interface PutRequest {
  type: 'put';
  trans: DBCoreTransaction;
  values: any[];
  keys?: Key[];
  wantResults?: boolean;
}
```
Input argument to [DBCoreTable](DBCoreTable).mutate(). See [DBCoreMutateRequest](DBCoreMutateRequest).
