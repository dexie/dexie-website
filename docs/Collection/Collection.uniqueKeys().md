---
layout: docs
title: 'Collection.uniqueKeys()'
---

### Syntax

```javascript
collection.uniqueKeys(callback)
```

### Parameters

<table>
<tr><td>callback: Function</td><td>function (keysArray) { }</td><td><i>optional</i></td></tr>
</table>

### Callback Parameters

<table>
<tr><td>keysArray: Array</td><td>Array of unique keys</td></tr>
</table>

### Return Value

[Promise](/docs/Promise/Promise)

### Description

Retrieves an array of all unique indexes in the collection.

### Sample

```javascript
db.friends.orderBy('firstName').uniqueKeys(function (keysArray) {
    // keysArray is now all firstNames without duplicates even if having multiple
    // friends with same name.
});
```

### Remarks

If callback is omitted and operation succeeds, returned Promise will resolve with the result of the operation, calling any [Promise.then()](/docs/Promise/Promise.then()) callback.

If callback is specified and operation succeeds, given callback will be called and the returned Promise will resolve with the return value of given callback.

If operation fails, returned promise will reject, calling any [Promise.catch()](/docs/Promise/Promise.catch()) callback.
