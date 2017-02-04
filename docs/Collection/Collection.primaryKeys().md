---
layout: docs
title: 'Collection.primaryKeys()'
---
*Since 1.4.0*

### Syntax

    collection.primaryKeys(callback)

### Parameters
<table>
<tr><td>callback: Function</td><td>function (keysArray) { }</td><td><i>optional</i></td></tr>
</table>

### Callback Parameters
<table>
<tr><td>keysArray: Array</td><td>Array of keys</td></tr>
</table>

### Return Value

[Promise](Promise)

### Performance Notice

Similar to [Collection.keys()](Collection.keys()), this operation is faster than [Collection.toArray()](Collection.toArray()) of several reasons. First because entire objects does not need to be instanciated (less data processsing). Secondly because the underlying database engine need not to do follow the primaryKey reference for each found item and load it (less disk IO).

This method will use [IDBObjectStore.getAllKeys()](https://developer.mozilla.org/en-US/docs/Web/API/IDBObjectStore/getAllKeys) / [IDBIndex.getAllKeys()](https://developer.mozilla.org/en-US/docs/Web/API/IDBIndex/getAllKeys) when available in the IndexedDB API to read all the primary keys. However, this optimization will only be used when collection is a NOT [reversed](Collection.reverse()), has no [offset](Collection.offset()) and is only filtered using a vanilla key range ([below()](WhereClause.below()), [above()](WhereClause.above()), [between()](WhereClause.between()), [equals()](WhereClause.equals()) or [Table.orderBy](Table.orderBy())), optionally combined with a [limit](Collection.limit()).

### Remarks

Selects primary keys of all items in the collection. 

Given callback / returned Promise, will recieve an array containing all primary keys of the index being indexed in the collection.

If callback is omitted and operation succeeds, returned Promise will resolve with the result of the operation, calling any [Promise.then()](Promise.then()) callback.

If callback is specified and operation succeeds, given callback will be called and the returned Promise will resolve with the return value of given callback.

If operation fails, returned promise will reject, calling any [Promise.catch()](Promise.catch()) callback.

### Sample

```javascript

db.transaction('r', db.friends, function*(){
    //
    // A simple logical AND operation based on multiple indices. Note: This sample is just
    // for showing an example using primaryKeys() method. In real life, it would be better
    // to use a compound index of [firstName+lastName] to resolve this kind of query!
    //

    // Search for friends where firstName = "hillary" and lastName = "clinton"
    var keys = yield Dexie.Promise.all([
        db.friends.where('firstName').equalsIgnoreCase('hillary').primaryKeys(),
        db.friends.where('lastName').equalsIgnoreCase('clinton').primaryKeys()]);

    // Find all common primary keys
    var intersection = keys[0].filter(key => keys[1].indexOf(key) !== -1);

    // At last look up the actual objects from these primary keys:
    return yield db.friends.where(':id').anyOf(intersection).toArray();
});

```
