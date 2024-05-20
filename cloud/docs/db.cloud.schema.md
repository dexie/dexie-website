---
layout: docs-dexie-cloud
title: 'db.cloud.schema'
---

The extended dexie-cloud information for each table in dexie schema. The schema is defined by the schema passed to `db.version(x).stores(...)` as and may be updated from dexie-cloud server after initial sync.

## Type

```ts
export type DexieCloudSchema = {
  [tableName: string]: {
    generatedGlobalId?: boolean
    idPrefix?: string
    deleted?: boolean
    markedForSync?: boolean
    initiallySynced?: boolean
    primaryKey?: string
  }
}
```

## Examples

**Get prefix for given table**

```ts
import type { Dexie } from 'dexie'
import type {} from 'dexie-cloud-addon' // extend typings for `db.cloud` to compile.

export function getIDPrefixFromTableName(db: Dexie, tableName: string) {
  if (!db.cloud?.schema)
    throw new Error(`dexie-cloud-addon not active or database not yet opened`)

  const dexieCloudSchema = db.cloud.schema[tableName]
  if (!dexieCloudSchema)
    throw new Error(`Could not find Dexie Cloud schema for ${tableName}`)

  return dexieCloudSchema.idPrefix ?? ''
}
```

**Get table for given primary key of an '@'-declared table**

```ts
import type { Dexie } from 'dexie'
import type {} from 'dexie-cloud-addon' // extend typings for `db.cloud` to compile.

export function getTableFromID(db: Dexie, id: string) {
  if (!db.cloud?.schema)
    throw new Error(`dexie-cloud-addon not active or database not yet opened`)

  const prefix = id.substring(3)
  for (const [tableName, dexieCloudSchema] of Object.entries(db.cloud.schema)) {
    if (dexieCloudSchema.idPrefix === prefix) return tableName
  }
  return null
}
```
