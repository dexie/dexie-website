---
layout: docs
title: "Table.hook('deleting')"
---

*NOTE: Since Dexie 3.0, there is a new API superior to this hooks API: [DBCore](/docs/DBCore/DBCore). There is NO PLAN for deprecation of this hooks API though, but it in future, we may extract this API to an addon.*

### Syntax

```javascript
db.[tableName].hook('deleting', function (primKey, obj, transaction) {
    // You may do additional database operations using given transaction object.
    // You may set this.onsuccess = callback when delete operation completes.
    // You may set this.onerror = callback if delete operation fails.
    // Any modification to obj is ignored.
    // Any return value is ignored.
    // throwing exception will make the db operation fail.
});
```

### Parameters
<table>
<tr><td>primKey</td><td>The primary key of the object being deleted</td></tr>
<tr><td>obj</td><td>Object that is about to be deleted. Modification of obj will NOT affect the operation.</td></tr>
<tr><td>transaction</td><td><a href="/docs/Transaction/Transaction">Transaction</a> instance.</td></tr>
<tr><td>&lt;<i>this</i> context&gt;</td><td>Possibility to be notified when the delete operation succeeds or fails. Done by setting this.onsuccess = function(){} or this.onerror = function(){}</td></tr>
</table>

### Return Value

Any return value of given subscriber is ignored.

### To Unsubscribe

```javascript
db.[tableName].hook('deleting').unsubscribe(yourListenerFunction)
```

### Description

This event is called whenever an object is about to be deleted from the database no matter which method is used. Methods that may delete objects are Table.delete(), Table.clear(), Collection.delete() but also Collection.modify() since it might be used for deleting objects as well.

A subscriber may use the given `transaction` object to do additional operations on the database. The chain of operations can be considered atomic since the subscriber can work on the same transaction as being used for deleting the object. 

### Error Handling

If subscriber throws an exception, the delete operation will fail and the caller of the delete operation will get the failure as a Promise rejection that may be caught/handled or not. If the caller of the delete operation does not catch the exception using Promise.catch(), the transaction will be aborted.

If a database operation initiated by the subscriber, results in a failure the transaction will be aborted no matter if the origin caller of the delete operation calls catch() or not. However, the origin caller will recieve your error if catching transaction failures. If you as the implementer of the subscriber want to ignore errors resulting from your operations, you may catch() your database operations to prohibit transaction from being aborted. However, it is normally better to let the transaction abort in case a failure of your database operation would impinge database consistency.

If setting this.onsuccess or this.onerror, those callback functions are responsible of not throwing any exception. Any code within that callback must either be bullet proof or surrounded by try/catch.

### Use Cases of the CRUD events

Dexie CRUD events can be used to implement several addons to Dexie such as:
* Server Synchronization
* Automatic primary key generation
* Full-text search or other custom ways of indexing properties
* Manipulation of returned objects

The add-ons [Dexie.Observable.js](/docs/Observable/Dexie.Observable.js) and [Dexie.Syncable.js](/docs/Syncable/Dexie.Syncable.js) uses  `hook('creating')`, `hook('updating')` and `hook('deleting')` to make the database locally observable as well as syncable with a remote server.

The `hook('reading')` is used internally by Dexie.js by the methods [Table.defineClass()](/docs/Table/Table.defineClass()) and [Table.mapToClass()](/docs/Table/Table.mapToClass()) in order to make all objects retrieved from database inherit a given class using prototypal inheritance.

### See Also

[Table.hook('creating')](/docs/Table/Table.hook('creating'))

[Table.hook('reading')](/docs/Table/Table.hook('reading'))

[Table.hook('updating')](/docs/Table/Table.hook('updating'))

[Dexie.Observable.js](/docs/Observable/Dexie.Observable.js)
