---
layout: docs
title: 'Dexie.SubTransactionError'
---

### Inheritance Hierarchy

* [Error](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
  * [Dexie.DexieError](/docs/DexieErrors/DexieError)
    * Dexie.SubTransactionError

### Description 

A call to [db.transaction()](/docs/Dexie/Dexie.transaction()) with a mode or set of tables that was not compatible with the currently ongoing transaction. For example:

```javascript
db.transaction('r', db.friends, ()=> {
    return db.transaction('rw', db.friends, db.pets, ()=> {

    }).catch(e => {
        // e will be SubTransactionError for two reasons:
        // 1. Parent transaction is readonly.
        // 2. Parent transaction does not include db.pets.
    })
});
```

To work around this error, make sure that the parent transaction includes all tables that subtransactions may include and that if subtransactions require 'rw' mode, use 'rw' mode also in parent transactions.

If you didn't have a parent transaction, but your transaction was initiated in your [Collection.each()](/docs/Collection/Collection.each()) or [Collection.modify()](/docs/Collection/Collection.modify()) callback, you should surround the call to Collection.each() / Collection.modify() with a transaction block, including the correct mode and tables to include.

### Sample using Promise.catch()

```javascript
doSomeDatabaseWork().then(result => {
    // Success
}).catch('SubTransactionError', e => {
    // Failed with SubTransactionError
    console.error ("SubTransaction error: " + e.message);
}).catch(Error, e => {
    // Any other error derived from standard Error
    console.error ("Error: " + e.message);
}).catch(e => {
    // Other error such as a string was thrown
    console.error (e);
});
```

### Sample: switch(error.name)

```javascript
db.on('error', function (error) {
    switch (error.name) {
        // errnames.SubTransaction ==="SubTransactionError"
        case Dexie.errnames.SubTransaction:
            console.error ("SubTransaction error");
            break;
        default:
            console.error ("error: " + e);
    }
});
```

### Properties

<table>
<tr><td>name</td><td>Will always be Dexie.errnames.SubTransaction === "SubTransactionError"</td></tr>
<tr><td>message</td><td>Detailed message</td></tr>
<tr><td>inner?</td><td>Inner exception instance (if any)</td></tr>
<tr><td>stack</td><td>Can be present if the error was thrown. If signaled, there wont be any call stack.</td></tr>
</table>
