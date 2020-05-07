---
layout: docs
title: 'DBCoreDeleteRangeRequest'
---

```ts
export interface DBCoreDeleteRangeRequest {
  type: 'deleteRange';
  trans: DBCoreTransaction;
  range: DBCoreKeyRange;
}
```
Input argument to [DBCoreTable](DBCoreTable).mutate(). See [DBCoreMutateRequest](DBCoreMutateRequest).

## See Also
* [DBCoreKeyRange](DBCoreKeyRange)
