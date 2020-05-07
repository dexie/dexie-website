---
layout: docs
title: 'DBCoreOpenCursorRequest'
---

```ts
export interface DBCoreOpenCursorRequest {
  trans: DBCoreTransaction;
  values?: boolean;
  unique?: boolean;
  reverse?: boolean;
  query: DBCoreQuery;
}
```
Input parameter to [DBCoreTable](DBCoreTable).openCursor()

## See Also
* [DBCoreTransaction](DBCoreTransaction)
* [DBCoreQuery](DBCoreQuery)
