---
layout: docs
title: 'Dexie.ignoreTransaction()'
---

### Syntax

```javascript
Dexie.ignoreTransaction(function() {
    // Launch a db operation or start a transaction.
});
```

### Description

This method makes it possible to launch a transaction or database operation that doesn't depend on the current transaction.

The method will set [Dexie.currentTransaction](/docs/Dexie/Dexie.currentTransaction) to null within the callback function and every database operation it will launch. 

### Sample

```javascript
db.transaction('rw', db.friends, function () {
    db.friends.add({name: "Hillary"}).then(function() {
        log("Hillary was added");
    });
});

function log (message) {
    // Our callers should not have to include the "logs" table in
    // it's transactions.
    // To make sure we add the log entry using a fresh transaction, we
    // use the ignoreTransaction() method:
    Dexie.ignoreTransaction(function() {
        db.logs.add({message: message, date: new Date()});
    });
}
```
