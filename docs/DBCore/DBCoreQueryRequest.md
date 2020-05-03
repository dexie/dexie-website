---
layout: docs
title: 'DBCoreQueryRequest'
---

```ts
export interface DBCoreQueryRequest<TQuery=DBCoreQuery> {
  trans: DBCoreTransaction;
  values?: boolean;
  limit?: number;
  query: TQuery;
}
```
