---
layout: docs
title: 'Dexie.BulkError'
---

### Inheritance Hierarchy

* [Error](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
  * [Dexie.DexieError](DexieError)
    * Dexie.BulkError

### Description 
Error that may occur in [Table.bulkAdd()](Table.bulkAdd()).

The method that may throw this error can perform multiple operations on a table.  Therefore this error object will contain an array of the errors the occurred during the failed operations. 

### Properies

<table>
<tr><td>failures</td><td>Array of Error objects of all errors that have occurred</td></tr>
</table>

### Properties derived from Error

#### [message](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error/message)

#### [name](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error/name)

### Sample 

```javascript
db.friends.bulkAdd([
    {id: "shouldBeUnique", name: "Foo", age: 99},
    {id: "shouldBeUnique", name: "Bar", age 21}])
.catch(Dexie.BulkError, function (err) {
    err.failures.forEach(function (failure) {
        console.error (failure.message);
    });
});
```

Note: Catching the error means that the successful operations will be saved. If not catching the error, all operations will be reverted and if there is an ongoing transaction, it will be aborted.

