---
layout: docs
title: 'DBCoreQueryRequest'
---

```ts
export interface DBCoreQueryRequest {
  trans: DBCoreTransaction;
  values?: boolean;
  limit?: number;
  query: DBCoreQuery;
}
```
Input parameter to [DBCoreTable](DBCoreTable).query()

## See Also
* [DBCoreTransaction](DBCoreTransaction)
