---
layout: docs
title: 'Collection.keys()'
---

### Syntax

```javascript
collection.keys(callback)
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

Similar to [Collection.primaryKeys()](/docs/Collection/Collection.primaryKeys()), this operation is faster than [Collection.toArray()](/docs/Collection/Collection.toArray()) of several reasons. First because entire objects does not need to be instantiated (less data processing). Secondly because the underlying database engine need not to do follow the primaryKey reference for each found item and load it (less disk IO).

### Remarks

Given callback will recieve an array containing all keys of the index being indexed in the collection. Can only be used on indexes and not on primary keys.

If callback is omitted and operation succeeds, returned Promise will resolve with the result of the operation, calling any [Promise.then()](/docs/Promise/Promise.then()) callback.

If callback is specified and operation succeeds, given callback will be called and the returned Promise will resolve with the return value of given callback.

If operation fails, returned promise will reject, calling any [Promise.catch()](/docs/Promise/Promise.catch()) callback.

### Sample

```javascript
// List all the first name of all my friends:
db.friends.orderBy('firstName').keys(function (firstNames) {
    alert ("My friends are: " + firstNames.join(','));
});

// List all shoeSizes that my friends have (duplicates removed):
db.friends.orderBy('shoeSize').uniqueKeys(function (shoeSizes) {
    alert ("My friends have the following shoe sizes: " + shoeSizes.join(','));
});

// Not possible to use keys(), uniqueKeys(), eachKey() or eachUniqueKey() when
// Collection instance is based on the primary key:
db.friends.orderBy(':id').keys() // Will fail!
```
