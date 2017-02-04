---
layout: docs
title: 'Collection.delete()'
---
Deletes all objects in the query.

### Syntax

    collection.delete()

### Return Value

[Promise](/docs/Promise/Promise) where result is the Number of deleted records. 

### Error Handling
If any object fails to be deleted or an exception occurs in a callback function, the entire operation will fail and the transaction will be aborted.

If you catch the returned Promise, the transaction will not abort, and you recieve a [Dexie.MultiModifyError](/docs/Dexie/Dexie.MultiModifyError) error object containing the following properties:

<table>
<tr><td>failures</td><td>Array of Error objects for all errors that have occurred</td></tr>
<tr><td>failedKeys</td><td>Array with the keys of the failed deletions. This array will have the same order as failures so that failures[i] will always represent the failure of failedKeys[i]</td></tr>
<tr><td>successCount</td><td>Number of successful deletions made.</td></tr>
</table>

If you do NOT catch the returned Promise, and an error occurs, the transaction will be aborted.

If you want to log the error but still abort the transaction, you must encapsulate the operation in a transaction() block and catch the transaction instead. It is also possible to catch the operation and call transaction.abort() in the catch() clause.

### Sample

```javascript
db.orders
    .where("state").anyOf("finished", "discarded")
    .or("date").below("2014-02-01")
    .delete()
    .then(function (deleteCount) {
        console.log( "Deleted " + deleteCount + " objects");
    });
```

With yield (Supported since 2015 by Chrome, Firefox, Opera and Edge):

```javascript
db.transaction('rw', db.orders, function* () {
    var deleteCount = yield db.orders
        .where("state").anyOf("finished", "discarded")
        .or("date").below("2014-02-01")
        .delete();

    console.log ("Successfully deleted " + deleteCount + " items");
}).catch (e => {
    console.error (e);
});
```

With Typescript:

```javascript
async function myDeleteFunction () {
    let deleteCount = await db.orders
        .where("state").anyOf("finished", "discarded")
        .or("date").below("2014-02-01")
        .delete();
}
```

### Remarks

Collection.delete() is equivalent to:

```javascript
Collection.modify(function () {delete this.value;});
````
..but Collection.delete() is much faster than deleting using Collection.modify().
