---
layout: docs
title: 'Dexie.waitFor()'
---

*Since Dexie 2.0*

### Syntax

```javascript
Dexie.waitFor(promise, timeout=60000)
```

### Return Value

[Promise](/docs/Promise/Promise)

### Description

This method makes it possible execute asynchronic non-indexedDB work while still keeping current context as well as IDB transaction alive.

#### Keeps IndexedDB transaction alive

When used within a transaction, ongoing transaction will be kept busy until given promise is settled, and that way keeping it alive and prohibit it from automatically being committed.

#### Keeps observation context alive (liveQuery())

When used within the context of a liveQuery() querier callback, the observation context will be kept after the given promise resolves. In this case, it will not need to keep any transaction alive and does not load the CPU, unless the querier function also performs a transaction.

#### Use with caution

*WARNING: This method can be CPU intensive while waiting for given Promise. It typically triggers about 1000 dummy-queries while waiting for just a 100 milliseconds.*

Use with caution when the purpose is to keep a transaction alive as it may put unnecessary CPU load on the browser. A separate task will keep the transaction alive by propagating dummy-requests on the transaction while the given promise is being executed.

**However, when used outside a transaction, it will not load the CPU - for example for the purpose of keeping liveQuery context alive and not using it within a transaction**

When used for keeping a transaction alive, this method kind of implements an anti-pattern of how not to use indexedDB transactions. On the other hand, it works, is stable across all browsers, and is totally in line with the new [indexeddb-promises](https://github.com/inexorabletash/indexeddb-promises) proposal where this will be possible. So in a future version if the proposal goes live, Dexie will start ride upon that new API if the browser supports it.


### Relation to [IDBTransaction.waitUntil()](https://github.com/inexorabletash/indexeddb-promises#transactions)
As of current state of the [indexeddb-promises](https://github.com/inexorabletash/indexeddb-promises) proposal, [IDBTransaction.waitUntil()](https://github.com/inexorabletash/indexeddb-promises#transactions) will commit the transaction directly after it resolves, while Dexie.waitFor() can be reused several times within the same transaction. This is the reason why we name it differently - to distinguish it from the behavior of IDBTransaction.waitUntil(). If the proposal remains with this behavior, we could still use it to accomplish what we need here, but we would then have to execute the entire scope function using IDBTransaction.waitUntil().

### Sample 1

```javascript
function sleep (ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
await db.transaction('rw', db.friends, async ()=> {
    await Dexie.waitFor(sleep(100)); // Sleeps 100 milliseconds
    await db.friends.put({id: 1, name: "Åke"});
    await Dexie.waitFor(sleep(100)); // Sleeps 100 milliseconds
    let theMan = await db.friends.get(1);
    alert (`I still got the man: ${theMan.name}`);
});
```

### Sample 1 in plain old ES5 + ES6 Promise

```javascript
function sleep (ms) {
    return new Promise(function (resolve) { setTimeout(resolve, ms); });
}
db.transaction('rw', db.friends, function () {
    Dexie.waitFor(sleep(100)).then(function () { 
        return db.friends.put({id: 1, name: "Åke"});
    }).then(function () {
        return Dexie.waitFor(sleep(100));
    }).then(function () {
        return db.friends.get(1);
    }).then(function (theMan) {
        alert ('I still got the man: ' + theMan.name);
    });
})
```

The above samples shows that you can wait for non-IndexedDB Promises to complete while still keeping transaction alive. You can replace sleep() with WebCrypto calls, fetch() or $.ajax(). When `Dexie.waitFor()` resolves it is guaranteed that the transaction will be in an active state and possible to continue working on. Note however that while the given promise is being executed, the transaction may not be guaranteed to be in an active state (may temporarily be inactive), so the operation must NOT involve operations on the transaction. But when the waitFor() promise resolves, the transaction is guaranteed to be in active state again.

```javascript
await db.transaction('rw', db.friends, async () => {
    await Dexie.waitFor(mixedOperations());

    async function mixedOperations () {
        await sleep(100);
        await db.friends.get(1)
        .catch('TransactionInactiveError', ex => {
            // This will happen!
        });
    }

    await db.friends.get(1); // Will succeed though.
});
```

What to keep in mind is this:

* Don't access your own transaction in the operation you wait for using Dexie.waitFor().
* Just access non-IndexedDB work, OR another transaction separate from your own. For example, you MAY start a new top-level transaction or wait on other databases

```javascript
// We are only locking db.friends initially. But then later in the flow,
// we also lock db.pets to include it as we need it as well.
db.transaction('r', db.friends, () => {
    return db.friends.get({name: "Bert"}).then (bert => {
        return Dexie.waitFor(db.transaction('r!', db.pets, async () => {
            // Locked with exclamation mark ('r!') meaning new top-level transaction.
            return db.pets.where({owner: bert.id}).toArray();
        })).then(bertsPets => {
            bert.pets = bertsPets;
            return bert;
        });
    }).then(bertWithPets => {
        // bertWithPets is now a "friend" with a 'pets' property added to it, that
        // is an array of the pets that is owned by Bert.
    });
});
```

### Behavior of Dexie.waitFor() when not in a transaction

Dexie.waitFor() can also be used when your code is not executing within a transaction. It will then just be equaivalent to Promise.resolve(). This can be useful if you write code that does not encapsulate through transaction by itself, but may be encapsulated in a transaction by the caller. By using Dexie.waitFor() you ensure that non-indexedDB operations will keep any existing transaction alive in case caller has encapsulated your code in a transaction.
