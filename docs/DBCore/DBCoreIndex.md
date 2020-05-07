---
layout: docs
title: 'DBCoreIndex'
---

```ts
export interface DBCoreIndex {
  /** Name of the index, or null for primary key */
  readonly name: string | null;
  /** True if this index represents the primary key */
  readonly isPrimaryKey?: boolean;
  /** True if this index represents the primary key and is not inbound (http://dexie.org/docs/inbound) */
  readonly outbound?: boolean; 
  /** True if and only if keyPath is an array (http://dexie.org/docs/Compound-Index) */
  readonly compound?: boolean;
  /** keyPath, null for primary key, string for single-property indexes, Array<string> for compound indexes */
  readonly keyPath: null | string | string[];
  /** Auto-generated primary key (does not apply to secondary indexes) */
  readonly autoIncrement?: boolean;
  /** Whether index is unique. Also true if index is primary key. */
  readonly unique?: boolean;
  /** Whether index is multiEntry. */
  readonly multiEntry?: boolean;
  /** Extract (using keyPath) a key from given value (object) */
  readonly extractKey: (value: any) => any;
}
```
Represents an index or primary key in [DBCoreTableSchema](DBCoreTableSchema).

See also [DBCore](DBCore)
