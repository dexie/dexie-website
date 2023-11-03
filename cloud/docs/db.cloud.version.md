---
layout: docs-dexie-cloud
title: "db.cloud.version"
---

The version of dexie-cloud-addon module.

## Example

```ts
import { Dexie } from "dexie";
import dexieCloud from "dexie-cloud-addon";

const db = new Dexie("myDB", { addons: [dexieCloud] });
console.log(`We're using dexie-cloud-addon@${db.cloud.version}`);
```
