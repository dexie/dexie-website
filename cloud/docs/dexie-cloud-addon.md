---
layout: docs-dexie-cloud
title: "dexie-cloud-addon"
---

## Syntax

```
npm install dexie-cloud-addon
```

```js
import Dexie from "dexie";
import dexieCloud from "dexie-cloud-addon";

const db = new Dexie("mydb", {addons: [dexieCloud]});
db.version(1).stores({
  myTable: '@myId, myIndex1, myIndex2, ...'
});

db.cloud.configure(configOptions);
```
*For configOptions, see [db.cloud.configure()](db.cloud.configure())*

## Sync Flow

As with vanilla Dexie.js, the behaviour of the library is different when loading your app the very first time on a device - the declaration serves as a template for creating the database locally. For dexie-cloud-addon, the very first time app loads is also the very first time this app will contact the Dexie Cloud database and do an initial sync (after successful authentication).

When addon is active, the no requests put onto dexie will respond before there is an established sync with the cloud. In the inital sync, this will involve downloading all data that, according to the access control, is visible for the user.

When the user loads your app a second time, this will be pretty much in sync from start, but the yet the addon will make sure that any changes that has happened on the server will be applied on the client before proceeding the any queries to the local database.

## The '@' prefix

dexie-cloud-addon enables the new '@' prefix in front of primary keys. The prefix makes the primary key auto-generated with a universal ID.

## See Also

[db.cloud.configure()](db.cloud.configure())
