---
layout: docs
title: "Table.hook('reading')"
---

*NOTE: Since Dexie 3.0, there is a new API superior to this hooks API: [DBCore](/docs/DBCore/DBCore). There is NO PLAN for deprecation of this hooks API though, but it in future, we may extract this API to an addon.*

### Syntax

```javascript
db.[tableName].hook('reading', function (obj) {
    // You may return another object or modify existing object.
});
```

### Parameters
<table>
<tr><td>obj</td><td>Object that is about to be returned from database to caller</td></tr>
</table>

### Return Value

The subscriber must return the resulting object. If not modifying the object, subscriber must return the given obj instance. If modifying or replacing object, return the new object or modified existing object.

### To Unsubscribe

```javascript
db.[tableName].hook('reading').unsubscribe(yourListenerFunction)
```

### Description

This event is called whenever an object is about to be returned from database to the caller of Table.get() or any [Collection](/docs/Collection/Collection) method that yields database objects, but not methods with a filtering or modification purpose such as [Table.filter()](/docs/Table/Table.filter()) or [Table.modify()](/docs/Table/Table.modify()). Specifically, hook('reading') will filter objects returned by:

* [Table.get()](/docs/Table/Table.get())
* [Table.toArray()](/docs/Table/Table.toArray())
* [Table.each()](/docs/Table/Table.each())
* [Collection.toArray()](/docs/Collection/Collection.toArray())
* [Collection.sortBy()](/docs/Collection/Collection.sortBy())
* [Collection.each()](/docs/Collection/Collection.each())
* [Collection.first()](/docs/Collection/Collection.first())
* [Collection.last()](/docs/Collection/Collection.last())

But not for:

* The callback given to [Table.filter()](/docs/Table/Table.filter())
* The callback given to [Collection.and()](/docs/Collection/Collection.and()) 
* The callback given to [Collection.modify()](/docs/Collection/Collection.modify())

### Error Handling

If subscriber throws an exception, the read operation will fail and the caller of the read operation will get the failure as a Promise rejection that may be caught/handled or not. If the caller of the read operation does not catch the exception using Promise.catch(), the transaction will be aborted.

### Use Cases of the CRUD events

Dexie CRUD events can be used to implement several addons to Dexie such as:
* Server Synchronization
* Automatic primary key generation
* Full-text search or other custom ways of indexing properties
* Manipulation of returned objects

The add-ons [Dexie.Observable.js](/docs/Observable/Dexie.Observable.js) and [Dexie.Syncable.js](/docs/Syncable/Dexie.Syncable.js) uses  `hook('creating')`, `hook('updating')` and `hook('deleting')` to make the database locally observable as well as syncable with a remote server.

The `hook('reading')` is used internally by Dexie.js by the methods [Table.defineClass()](/docs/Table/Table.defineClass()) and [Table.mapToClass()](.docs/Table/Table.mapToClass()) in order to make all objects retrieved from database inherit a given class using prototypal inheritance.

### See Also

[Table.hook('creating')](/docs/Table/Table.hook('creating'))

[Table.hook('updating')](/docs/Table/Table.hook('updating'))

[Table.hook('deleting')](/docs/Table/Table.hook('deleting'))

[Dexie.Observable.js](/docs/Observable/Dexie.Observable.js)
