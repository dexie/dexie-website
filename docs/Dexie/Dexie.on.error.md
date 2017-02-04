---
layout: docs
title: 'Dexie.on.error'
---

## *Deprecated*
*This event is deprecated since Dexie v1.5.0 and obsolete since Dexie v2.0.0. Use `window.addEventListener('unhandledrejection', callback)` instead.*

*See [Deprecations](Deprecations)*

### NOTE!
This global error handler will only be if a failing promise leads to a cancelled database transaction. To also catch errors occurring outside of transactions, use [Dexie.Promise.on.error](Promise.on.error) instead!

### Syntax

    db.on("error", function (error) {});

### Parameters
<table>
<tr><td>error: Any</td><td>Any uncatched error from a request or transaction will bubble up to the subscriber.</td></tr>
</table>

### Remarks
This event will fire whenever you perform a database operation that fails, or if you are within a transaction scope and an exception is thrown.

db.on('error') will only fire in the following scenarios:
 * You are in a transaction scope and an exception occur and you dont catch the Promise returned from the db.transaction() method.
 * You are doing a database operation that fails with an exception and you don't catch the resulting promise.

But not if:
 * You are outside of a transaction and the error doesnt occur from within a database operation.

### Sample 1: Uncatched db Promise:

```javascript
db.on("error", function(e) { console.error (e.stack || e); });

db.friends.put(window.open); // Functions cannot be put into database.
// promise not catched, so the error will bubble to db.on('error').

```

### Sample 2: Exception in uncatched transaction:

```javascript

db.on("error", function(e) { console.error (e.stack || e); });
var transactionPromise = db.transaction('rw', db.people, function() {
    db.People.put({name: "Arne"}); // People misspelled
});
// transactionPromise not explicitely catched --> db.on('error') will fire.

```

### Samples where db.on('error') will NOT fire:

```javascript
db.open().then(function() {
    // People misspelled, but we are not in a transaction nor a db operation.
    db.People.put({name: "Arne"}); 
});
```

```javascript
db.transaction('rw', db.people, function() {
    db.People.put({name: "Arne"}); // People misspelled
}).catch(function (err) {
    // We explicitely catch the error, so it wont bubble to db.on('error')
});
```

### See Also

[Dexie.Promise.on.error](Promise.on.error)
