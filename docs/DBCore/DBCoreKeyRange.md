---
layout: docs
title: 'DBCoreKeyRange'
---

```ts
export interface DBCoreKeyRange {
  readonly type: DBCoreRangeType;
  readonly lower: any;
  readonly lowerOpen?: boolean;
  readonly upper: any;
  readonly upperOpen?: boolean;
}
```

Represents a DBCore KeyRange in [DBCoreDeleteRangeRequest](DBCoreDeleteRangeRequest) and [DBCoreQuery](DBCoreQuery).

## See Also
* [DBCoreRangeType](DBCoreRangeType).
