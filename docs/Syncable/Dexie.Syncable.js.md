---
layout: docs
title: 'Dexie.Syncable'
---

Enables two-way synchronization with a remote server of any kind.

**If you are looking for a batteries-included sync solution, check out the following alternatives:**

* **[Dexie Cloud](/cloud)** - our cloud based sync service 

or:

* **[sync-client](https://www.npmjs.com/package/sync-client)**
* **[sync-server](https://www.npmjs.com/package/sync-server)**

*These are built upon Dexie.Syncable but also implements ISyncProtocol and the backend.*

### Dependency Tree

 * **Dexie.Syncable.js**
   * [Dexie.Observable.js](/docs/Observable/Dexie.Observable.js)
     * [Dexie.js](/docs/Dexie/Dexie.js)
       * [IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)
   * _An implementation of [ISyncProtocol](/docs/Syncable/Dexie.Syncable.ISyncProtocol)_

### Tutorial

#### 1. Include Required Sources

Install over npm

```bash
npm install dexie
npm install dexie-observable
npm install dexie-syncable
```
Make sure to include dexie.js, dexie-observable.js, dexie-syncable.js and an implementation of [ISyncProtocol](/docs/Syncable/Dexie.Syncable.ISyncProtocol).

```javascript
import Dexie from 'dexie';
import 'dexie-observable';
import 'dexie-syncable';
import 'your-sync-protocol-implementation';
```

Or if using plain html:

```html
<html>
<head>
  <script src="dexie.js"></script>
  <script src="dexie-observable.min.js"></script>
  <script src="dexie-syncable.min.js"></script>
  <!-- Example implementation of ISyncProtocol -->
  <script src="WebSocketSyncProtocol.js"></script>
    ...
</head>
<body></body>
</html>
```

##### Usage with existing DB

In case you want to use Dexie.Syncable with your existing database, but do not want to use UUID based Primary Keys as described below, you will have to do a schema upgrade. Without it Dexie.Syncable will not be able to properly work.

```javascript
import Dexie from 'dexie';
import 'dexie-observable';
import 'dexie-syncable';
import 'your-sync-protocol-implementation';

var db = new Dexie('myExistingDb');
db.version(1).stores(... existing schema ...);

// Now, add another version, just to trigger an upgrade for Dexie.Syncable
db.version(2).stores({}); // No need to add / remove tables. This is just to allow the addon to install its tables.
```

#### 2. Use UUID based Primary Keys ($$)

Two way replication requires not to use auto-incremented keys if any sync node should be able to create objects no matter offline or online. Dexie.Syncable comes with a new syntax when defining your store schemas: the double-dollar prefix ($$). Similar to the ++ prefix in Dexie (meaning auto-incremented primary key), the double-dollar prefix means that the key will be given a universally unique identifier (UUID), in string format (For example "9cc6768c-358b-4d21-ac4d-58cc0fddd2d6").

```javascript
var db = new Dexie("MySyncedDB");
db.version(1).stores({
    friends: "$$oid,name,shoeSize",
    pets: "$$oid,name,kind"
});
```

#### 3. Connect to Server

You must specify the URL of the server you want to keep in-sync with. This has to be done once in the entire database life-time, but doing it on every startup is ok as well, since it wont affect already connected URLs.

```javascript
// This example uses the WebSocketSyncProtocol included in earlier steps.
db.syncable.connect ("websocket", "https://syncserver.com/sync");
db.syncable.on('statusChanged', function (newStatus, url) {
    console.log ("Sync Status changed: " + Dexie.Syncable.StatusTexts[newStatus]);
});
```

#### 4. Use Your Database

Query and modify your database as if it was a simple Dexie instance. Any changes will be replicated to server and and change on server or other window will replicate back to you.

```javascript
db.transaction('rw', db.friends, function (friends) {
    friends.add({name: "Arne", shoeSize: 47});
    friends.where(shoeSize).above(40).each(function (friend) {
        console.log("Friend with shoeSize over 40: " + friend.name);
    });
});
```

_NOTE: Transactions only provide the Atomicity part of the [ACID](http://en.wikipedia.org/wiki/ACID) properties when using 2-way syncronization. This is due to that the syncronization phase may result in that another change could override the changes. However, it's still meaningfull to use the transaction() since method for atomicity. Atomicity is guaranteed not only locally but also when synced to the server, meaning that a part of the changes will never commit on the server until all changes from the transaction has been synced. In practice, you cannot increment a counter in the database (for example) and expect it to be consistent, but you can be guaranteed that if you add a sequence of objects, all or none of them will replicate._

### API Reference

#### Static Members

##### [Dexie.Syncable.registerSyncProtocol (name, protocolInstance)](/docs/Syncable/Dexie.Syncable.registerSyncProtocol())
Define how to replicate changes with your type of server.

##### [Dexie.Syncable.Statuses](/docs/Syncable/Dexie.Syncable.Statuses)
Enum of possible sync statuses, such as OFFLINE, CONNECTING, ONLINE and ERROR.

##### [Dexie.Syncable.StatusTexts](/docs/Syncable/Dexie.Syncable.StatusTexts)
Text lookup for status numbers

#### Non-Static Methods and Events

##### [db.syncable.connect (protocol, url, options)](/docs/Syncable/db.syncable.connect())
Create a presistend a two-way sync connection with given URL.

##### [db.syncable.disconnect (url)](/docs/Syncable/db.syncable.disconnect())
Stop syncing with given URL but keep revision states until next connect.

##### [db.syncable.delete(url)](/docs/Syncable/db.syncable.delete())
Delete all states and change queue for given URL

##### [db.syncable.list()](/docs/Syncable/db.syncable.list())
List the URLs of each remote node we have a state saved for.

##### [db.syncable.on('statusChanged')](/docs/Syncable/db.syncable.on('statusChanged'))
Event triggered when sync status changes.

##### [db.syncable.getStatus (url)](/docs/Syncable/db.syncable.getStatus())
Get sync status for given URL.

##### [db.syncable.getOptions (url)](/docs/Syncable/db.syncable.getOptions())

Get the options object for the given URL.

### Source

[Dexie.Syncable.js](https://github.com/dfahlander/Dexie.js/blob/master/addons/Dexie.Syncable/src/Dexie.Syncable.js)

### Description

Dexie.Syncable enables syncronization with a remote database (of almost any kind). It has it's own API [ISyncProtocol](/docs/Syncable/Dexie.Syncable.ISyncProtocol). The [ISyncProtocol](/docs/Syncable/Dexie.Syncable.ISyncProtocol) is pretty straight-forward to implement. The implementation of that API defines how client- and server- changes are transported between local and remote nodes. The API support both poll-patterns (such as ajax calls) and direct reaction pattern (such as WebSocket or long-polling methods). See samples below for each pattern.

### Sample [ISyncProtocol](/docs/Syncable/Dexie.Syncable.ISyncProtocol) Implementations
 * [https://github.com/nponiros/sync_client](https://github.com/nponiros/sync_client)
 * [AjaxSyncProtocol.js](https://github.com/dfahlander/Dexie.js/blob/master/samples/remote-sync/ajax/AjaxSyncProtocol.js)
 * [WebSocketSyncProtocol.js](https://github.com/dfahlander/Dexie.js/blob/master/samples/remote-sync/websocket/WebSocketSyncProtocol.js)

### Sample Sync Servers
 * [https://github.com/nponiros/sync_server](https://github.com/nponiros/sync_server)
 * [WebSocketSyncServer.js](https://github.com/dfahlander/Dexie.js/blob/master/samples/remote-sync/websocket/WebSocketSyncServer.js)
