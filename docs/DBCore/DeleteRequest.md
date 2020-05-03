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
