---
layout: docs
title: 'Dexie.ModifyError'
---

### Inheritance Hierarchy

- [Error](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
  - [Dexie.DexieError](/docs/DexieErrors/DexieError)
    - Dexie.ModifyError

### Description

Error that may occur in [Collection.modify()](</docs/Collection/Collection.modify()>) and [Collection.delete()](</docs/Collection/Collection.delete()>)

The methods that may throw this error can perform multiple operations on a collection. Therefore this error object will contain an array of the errors the occurred during the failed operations.

### Properies

<table>
<tr><td>failures</td><td>Array of Error objects of all errors that have occurred</td></tr>
<tr><td>failedKeys</td><td>Array of the keys of the failed modifications. This array will have the same order as failures so that failures[i] will always represent the failure of failedKeys[i]</td></tr>
<tr><td>successCount</td><td>Number of successful modifications made. NOTE: Only useful in case error is caught and transaction is not aborted.</td></tr>
</table>

### Properties derived from Error

#### [message](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error/message)

#### [name](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error/name)

### Sample

```javascript
db.friends.where('name').startsWith('a').delete ()
    .catch(function (err) {
        if (err instanceof Dexie.ModifyError) {
            err.failures.forEach(function (failure) {
            console.error (failure.stack || failure.message);
        } else {
            throw err;
        }
    });
});
```

With yield

```javascript
db.transaction('rw', db.friends, function* ()=> {
    try {
        var numDeleted = yield db.friends
                                 .where('name').startsWithIgnoreCase('a')
                                 .delete();
    } catch (err) {
        if (err instanceof Dexie.ModifyError) {
            // Handle ModifyErrors explicitly
            err.failures.forEach(function (failure) {
            console.error (failure.stack || failure.message);
        } else {
            // Rethrow error of other types to ensure transaction is cancelled.
            throw e;
        }
    }
});
```
