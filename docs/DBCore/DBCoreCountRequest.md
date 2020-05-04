---
layout: docs
title: 'DBCoreCountRequest'
---

```ts
export interface DBCoreCountRequest<TQuery=DBCoreQuery> {
  trans: DBCoreTransaction;
  query: TQuery;
}
```
Used as input parameter to [DBCoreTable](DBCoreTable).count()
