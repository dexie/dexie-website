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
