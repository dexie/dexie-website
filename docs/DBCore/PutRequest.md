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
