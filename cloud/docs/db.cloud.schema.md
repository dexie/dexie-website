---
layout: docs-dexie-cloud
title: "db.cloud.schema"
---

The extended dexie-cloud information for each table in dexie schema. The schema is defined by the schema passed to `db.version(x).stores(...)` as and may be updated from dexie-cloud server after initial sync.

## Type

```ts
export type DexieCloudSchema = {
  [tableName: string]: {
    generatedGlobalId?: boolean;
    idPrefix?: string;
    deleted?: boolean;
    markedForSync?: boolean;
    initiallySynced?: boolean;
    primaryKey?: string;
  };
};
```
