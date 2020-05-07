---
layout: docs
title: 'DBCoreTableSchema'
---

```ts
export interface DBCoreTableSchema {
  readonly name: string;
  readonly primaryKey: DBCoreIndex;
  readonly indexes: DBCoreIndex[];
  readonly getIndexByKeyPath: (keyPath: null | string | string[]) => DBCoreIndex | undefined;
}
```
Table schema structure in [DBCoreSchema](DBCoreSchema).

## See Also
* [DBCoreIndex](DBCoreIndex)
