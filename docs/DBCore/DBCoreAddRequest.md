---
layout: docs
title: 'DBCoreAddRequest'
---

```ts
export interface DBCoreAddRequest {
  type: 'add';
  trans: DBCoreTransaction;
  values: any[];
  keys?: any[];
  wantResults?: boolean;
}
```

See [DBCoreMutateRequest](DBCoreMutateRequest) and [DBCoreTable](DBCoreTable).

