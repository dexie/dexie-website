---
layout: docs-dexie-cloud
title: "db.cloud.options"
---

The configuration options used with [db.cloud.configure()](<db.cloud.configure()>).

## Type

[DexieCloudOptions](DexieCloudOptions)

## Example

```ts
import { Dexie } from "dexie";
import dexieCloud from "dexie-cloud-addon";

const db = new Dexie("myDB", { addons: [dexieCloud] });
db.version(1).stores({
  friends: "@id, age, name",
});
db.cloud.configure({
  databaseUrl: "https://xxxx.dexie.cloud",
});

console.log(`We're using database URL: ${db.cloud.options.databaseUrl}`);
```
