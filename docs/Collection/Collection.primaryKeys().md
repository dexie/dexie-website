---
layout: docs
title: 'Collection.primaryKeys()'
---

*Since 1.4.0*

### Syntax

```javascript
collection.primaryKeys(callback)
```

### Parameters

<table>
<tr><td>callback: Function</td><td>function (keysArray) { }</td><td><i>optional</i></td></tr>
</table>

### Callback Parameters

<table>
<tr><td>keysArray: Array</td><td>Array of keys</td></tr>
</table>

### Return Value

[Promise](/docs/Promise/Promise)

### Performance Notice

Similar to [Collection.keys()](/docs/Collection/Collection.keys()), this operation is faster than [Collection.toArray()](/docs/Collection/Collection.toArray()) of several reasons. First because entire objects does not need to be instanciated (less data processsing). Secondly because the underlying database engine need not to do follow the primaryKey reference for each found item and load it (less disk IO).

This method will use [IDBObjectStore.getAllKeys()](https://developer.mozilla.org/en-US/docs/Web/API/IDBObjectStore/getAllKeys) / [IDBIndex.getAllKeys()](https://developer.mozilla.org/en-US/docs/Web/API/IDBIndex/getAllKeys) when available in the IndexedDB API to read all the primary keys. However, this optimization will only be used when collection is a NOT [reversed](/docs/Collection/Collection.reverse()), has no [offset](/docs/Collection/Collection.offset()) and is only filtered using a vanilla key range ([below()](/docs/WhereClause/WhereClause.below()), [above()](/docs/WhereClause/WhereClause.above()), [between()](/docs/WhereClause/WhereClause.between()), [equals()](/docs/WhereClause/WhereClause.equals()) or [Table.orderBy](.docs/Table/Table.orderBy())), optionally combined with a [limit](/docs/Collection/Collection.limit()).

### Remarks

Selects primary keys of all items in the collection. 

Given callback / returned Promise, will recieve an array containing all primary keys of the index being indexed in the collection.

If callback is omitted and operation succeeds, returned Promise will resolve with the result of the operation, calling any [Promise.then()](/docs/Promise/Promise.then()) callback.

If callback is specified and operation succeeds, given callback will be called and the returned Promise will resolve with the return value of given callback.

If operation fails, returned promise will reject, calling any [Promise.catch()](/docs/Promise/Promise.catch()) callback.

### Sample

```javascript
db.transaction('r', db.friends, async () => {
  //
  // A simple logical AND operation based on multiple indices.
  // Note: This sample is just for showing an example using primaryKeys() method.
  // In real life, it would be better to use a compound index
  // of [firstName+lastName] to resolve this kind of query!
  //

  // Search for friends where firstName = "hillary" and lastName = "clinton"
  const keys = await Promise.all([
    db.friends.where('firstName').equalsIgnoreCase('hillary').primaryKeys(),
    db.friends.where('lastName').equalsIgnoreCase('clinton').primaryKeys()
  ]);

  // Find all common primary keys
  var intersection = keys[0].filter(key => keys[1].indexOf(key) !== -1);

  // At last look up the actual objects from these primary keys:
  return await db.friends.where(':id').anyOf(intersection).toArray();
});
```
