---
layout: docs
title: 'DBCoreOpenCursorRequest'
---

```ts
export interface DBCoreOpenCursorRequest<TQuery=DBCoreQuery> {
  trans: DBCoreTransaction;
  values?: boolean;
  unique?: boolean;
  reverse?: boolean;
  query: TQuery;
}
```
Input parameter to [DBCoreTable](DBCoreTable).openCursor()
