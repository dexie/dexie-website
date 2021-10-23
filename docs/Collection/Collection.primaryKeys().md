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

This method will use [IDBObjectStore.getAllKeys()](https://developer.mozilla.org/en-US/docs/Web/API/IDBObjectStore/getAllKeys) / [IDBIndex.getAllKeys()](https://developer.mozilla.org/en-US/docs/Web/API/IDBIndex/getAllKeys) when available in the IndexedDB API to read all the primary keys. However, this optimization will only be used when collection is a NOT [reversed](/docs/Collection/Collection.reverse()), has no [offset](/docs/Collection/Collection.offset()) and is only filtered using a vanilla key range ([below()](/docs/WhereClause/WhereClause.below()), [above()](/docs/WhereClause/WhereClause.above()), [between()](/docs/WhereClause/WhereClause.between()), [equals()](/docs/WhereClause/WhereClause.equals()), [startsWith()](/docs/WhereClause/WhereClause.startsWith()) or [Table.orderBy](/docs/Table/Table.orderBy())), optionally combined with a [limit](/docs/Collection/Collection.limit()).

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
  // A simple logical AND operation based on multiple indexes.
  // This sample assumes your primary keys (ids) are strings or numbers
  // as Set won't work for arrays or Dates.
  //
  // The last criteria will define the order. To change which criteria to define the order,
  // swap the criterias to have the ordering criteria last.
  //
  // To order by an index that is not part of the critera, use [Table.orderBy()](https://dexie.org/docs/Table/Table.orderBy())
  // as if it was a criteria (for example `db.friends.orderBy('shoeSize').primaryKeys()`) and put it last.
  //

  // Search for friends where firstName starts with "Ali", lastName
  // starts with "Svens" and age is in the range 18..65.
  const results = await Promise.all([
  
    db.friends
      .where('firstName')
      .startsWith('Ali')
      .primaryKeys(),
      
    db.friends
      .where('lastName')
      .startsWith('Svens')
      .primaryKeys(),
      
    db.friends
      .where('age')
      .between(18, 65)
      .primaryKeys()
      
    //... (more operands to AND with)
  ]);
  
  // Ok, so now we have all primary keys from all queries stored in separate results

  // Find all common primary keys
  const intersection = results.reduce((ids1, ids2) => {
    const set = new Set(ids1);
    return ids2.filter(id => set.has(id));
  });

  // At last look up the actual objects from these primary keys:
  return await db.friends.bulkGet(intersection);
});
```
