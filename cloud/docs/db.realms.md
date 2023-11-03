---
layout: docs-dexie-cloud
title: "db.realms"
---

The `db.realms` table is added to the schema when having [dexie-cloud-addon](dexie-cloud-addon) applied. Each realm object represents an access controlled partition of objects, see [Access Control in Dexie Cloud](access-control).

The primary key is `realmId`, which is a globally unique string with the 'rlm' prefix.
