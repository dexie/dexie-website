---
layout: docs
title: 'DeleteRangeRequest'
---

```ts
export interface DeleteRangeRequest {
  type: 'deleteRange';
  trans: DBCoreTransaction;
  range: KeyRange;
}
```
Input argument to [DBCoreTable](DBCoreTable).mutate(). See [DBCoreMutateRequest](DBCoreMutateRequest).

