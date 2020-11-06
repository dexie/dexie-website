---
layout: docs
title: 'db.syncable.connect()'
---
See also [Dexie Cloud](/cloud/).

### Syntax

```typescript
db.syncable.connect (
  protocol: string,
  url: string,
  options: Object
) : Promise<void>
```

### Parameters

<table>
<tr>
  <td>protocol : String</td>
  <td>
    Name of protocol. An Implementation of <a href="/docs/Syncable/Dexie.Syncable.ISyncProtocol">ISyncProtocol</a> must have been registered using <a href="/docs/Syncable/Dexie.Syncable.registerSyncProtocol()">Dexie.Syncable.registerSyncProtocol()</a>
  </td>
</tr>
<tr><td>url : String</td><td>URL to connect to</td></tr>
<tr><td>options : Object</td><td>Options that the registered protocol can handle. Options are specific to each ISyncProtocol implementation</td></tr>
</table>

### Return Value

[Promise](/docs/Promise/Promise)

### Description

Connect to given URL using given protocol and options. Returned Promise will resolve when [sync-protocol](/docs/Syncable/Dexie.Syncable.ISyncProtocol) has called its [onSuccess()](/docs/Syncable/Dexie.Syncable.ISyncProtocol#onsuccess--function-continuation) callback. If [sync-protocol](/docs/Syncable/Dexie.Syncable.ISyncProtocol) calls [onError()](/docs/Syncable/Dexie.Syncable.ISyncProtocol#onerror--error-again), the returned promise will reject but the underlying framework may continue to try connecting in the background. If you want to stop this, call [db.syncable.disconnect (url)](/docs/Syncable/db.syncable.disconnect()) in your catch clause.

Once connected, you will never have to call connect() again. Not even after a reboot. The framework will keep in sync forever with this node until a call to disconnect(), delete() happens, or if an irrepairable error occur on the node (not network down, but a fatal error).

The very first time that connect() is called upon an URL, the framework will start syncing the entire indexedDB database towards the sync protocol implementation. If this is not desired, supply option `{initialUpload: false}` in your connect call.

Calling connect() when the node is already connected, will not generate any sync operation but result in an immediate resolve of returned Promise.

## Sample

```javascript
import Dexie from 'dexie';
import 'dexie-observable';
import 'dexie-syncable';

//
// 1. Register Your Protocol(s)!
//
Dexie.Syncable.registerSyncProtocol("myProtocol", {
    sync: function (...) {...}; // An ISyncProtocol implementation.
});

//
// 2. Declare Your Database.
//
var db = new Dexie('mydb');
db.version(1).stores({foo: 'id'});

//
// 3. Call db.syncable.connect().
//
db.syncable.connect(
    "myProtocol",
    "https://remote-server/...",
    {options...})
.catch(err => {
    console.error (`Failed to connect: ${err.stack || err}`);
});

//
// 4. Start using the database as normal.
//
db.foo.toArray().then(foos => {
    // This promise will not resolve before an initial sync has taken place.
    // For sure, your data will be populated from server when you get here.
    // Very First Time - you need to be online to get here!
    // After that: you can get here even if you are offline.
}).catch(err => {
    // May happen if this was you app's initial load and you were offline.
});

```

## See also

[Dexie.Syncable.js](/docs/Syncable/Dexie.Syncable.js)

