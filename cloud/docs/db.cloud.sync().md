---
layout: docs-dexie-cloud
title: "db.cloud.sync()"
---

Sync local database with the server. In most situations, it is not needed to call db.cloud.sync() explicitely as it will always keep an eager sync between client and server automatically. However, this behavior can be turned off using the options [disableWebSocket](<db.cloud.configure()#disablewebsocket>) (turning off eager listening of remote changes) or [disableEagerSync](<db.cloud.configure()#disableeagersync>) (turning off eager listening of local changes).

This method can also be used when eager sync is not turned off - for example directly after a login of a new user is complete, a call to db.cloud.sync({purpose: 'pull'}) will make sure the returned promise won't complete until the user got all the data from the server initially - which could be usefull if wanting to wait for initial sync to complete before starting to query the database.

## Syntax

```ts
await db.cloud.sync(); // Sync if we have unsynced changes and wait til it's done.
await db.cloud.sync({ wait: false }); // Sync if we have unsynced changes. Don't wait for sync to be done.
await db.cloud.sync({ purpose: "pull" }); // Sync regardless of whether we have unsynced changes or not.
```

## Parameters

| Parameters | Default | Description                                             |
| ---------- | ------- | ------------------------------------------------------- |
| wait       | true    | Don't resolve promise until the sync is completely done |
| purpose    | 'push'  | The purpose of the sync. Either 'push' or 'pull'.       |

## Return Value

`Promise<void>`

## Remarks

This method makes sure to sync if it is needed according to given purpose. In case the option [tryUseServiceWorker](<db.cloud.configure()#tryuseserviceworker>) was configured, the service worker will be notified for sync and we will wait until the service worker is done with its job. Else, the sync will happen in the main thread. If a sync is already ongoing with a compatible purpose, the method will just wait for that ongoing sync to complete and not cause another sync to happen.
