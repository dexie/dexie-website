---
layout: docs
title: "Table.hook('reading')"
---

### Syntax

    db.[tableName].hook('reading', function (obj) {
        // You may return another object or modify existing object.
    });

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

This event is called whenever an object is about to be returned from database to the caller of Table.get() or any [Collection](Collection) method that yields database objects, but not methods with a filtering or modification purpose such as [Table.filter()](Table.filter()) or [Table.modify()](Table.modify()). Specifically, hook('reading') will filter objects returned by:
* [Table.get()](Table.get())
* [Table.toArray()](Table.toArray())
* [Table.each()](Table.each())
* [Collection.toArray()](Collection.toArray())
* [Collection.sortBy()](Collection.sortBy())
* [Collection.each()](Collection.each())
* [Collection.first()](Collection.first())
* [Collection.last()](Collection.last())

But not for:
* [Table.filter()](Table.filter())
* [Collection.and()](Collection.and()) 
* [Collection.modify()](Collection.modify())

### Error Handling

If subscriber throws an exception, the read operation will fail and the caller of the read operation will get the failure as a Promise rejection that may be catched/handled or not. If the caller of the read operation does not catch the excetion using Promise.catch(), the transaction will be aborted.

### Use Cases of the CRUD events

Dexie CRUD events can be used to implement several addons to Dexie such as:
* Server Synchronization
* Automatic primary key generation
* Full-text search or other custom ways of indexing properties
* Manipulation of returned objects

The add-ons [Dexie.Observable.js](Dexie.Observable.js) and [Dexie.Syncable.js](Dexie.Syncable.js) uses  `hook('creating')`, `hook('updating')` and `hook('deleting')` to make the database locally observable as well as syncable with a remote server.

The `hook('reading')` is used internally by Dexie.js by the methods [Table.defineClass()](Table.defineClass()) and [Table.mapToClass()](Table.mapToClass()) in order to make all objects retrieved from database inherit a given class using prototypal inheritance.

### See Also

[Table.hook('creating')](Table.hook('creating'))

[Table.hook('updating')](Table.hook('updating'))

[Table.hook('deleting')](Table.hook('deleting'))

[Dexie.Observable.js](Dexie.Observable.js)
