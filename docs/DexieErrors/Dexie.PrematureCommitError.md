---
layout: docs
title: 'Dexie.PrematureCommitError'
---

### Inheritance Hierarchy
*Since 2.0.0*

* [Error](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
  * [Dexie.DexieError](/docs/DexieErrors/DexieError)
    * Dexie.PrematureCommitError

### Description 

This exception will be thrown when the indexedDB transaction commits before the promise returned by your transaction scope is resolved or rejected.

### Solution:

1. Make sure to never call other async APIs from within a transaction
2. Always use the global Promise (or Dexie.Promise) inside transactions.
3. If using native async/await, avoid awaiting non-promises in loops.

#### NOT OK:

```javascript
db.transaction ('rw', db.friends, () => {
    return fetch(someUrl); // fetch() is a non-indexedDB async API.
});

db.transaction ('rw', db.friends, () => {
    return new Promise (resolve => {
        setTimeout(resolve, 100); // setTimeout is non-indexedDB async API.
    });
});

db.transaction ('rw', db.friends, async () => {
    for (let i=0; i<100; ++i) {
        await null; // Don't await non-promises.
    }
});
```

##### OK:

```javascript
db.transaction ('rw', db.friends, async () => {
    for (let i=0; i<100; ++i) {
        // If you need to await something that may be non-promise,
        // Use Promise.resolve() around it.
        await Promise.resolve(null); 
    }
});
```


*Dont call setTimeout() or any other async API from inside a transaction.*


#### NOT OK:

```javascript
let Promise = require('bluebird');
db.transaction('r', db.friends, () => {
    // Promise is not the global Promise. It might break transactions.
    return new Promise((resolve, reject) => {
        db.friends.get(1).then(resolve, reject);
    });
});
```

*Don't use 3-rd party promises within transactions. Must only use Dexie.Promise or the built-in promise (window.Promise / self.Promise / global.Promise) within transactions.*

#### THIS IS OK (in Dexie 2.0.0 and above):

```javascript
db.transaction('r', db.friends, function () {
    // In Dexie 2.0, it's ok to use the global Promise (window.Promise)
    return Promise.all([
        db.friends.get(1),
        db.friends.get(2)
    ]);
});
```

#### THIS IS ALSO OK:

```javascript
db.transaction('r', db.friends, async () => {
    // In Dexie 2.0, it's ok to use the global Promise (window.Promise)
    return await Promise.all([
        db.friends.get(1),
        db.friends.get(2),
        Promise.resolve(3) // Encapsulate non-promises with Promise.resolve() when awaiting things.
    ]);
});
```

Since Dexie 2.0, you may use the global Promise within transactions, since it will always be temporary patched within the transaction zone. But interactions with non-Dexie API:s must only be done outside transactions. For example if you need to fetch data from a REST API, do that before entering the transaction. And if you need to call REST API based on a database query, do that when your transaction completes.

#### THIS IS OK:

```javascript
async function sample() {

    // First, you fetch:
    let restData = await fetch(someUrl);

    // Then, you do the transaction:
    let dbResult = await db.transaction('rw', db.someTable, async ()=> {
        let changedItems = await db.someTable
            .where('changeDate').above(lastSyncDate)
            .toArray();

        await db.someTable.bulkPut(restData);

        return changedItems;
    });

    // When transaction has finally completed, you can interact with fetch again:
    await fetch(someUrl, {method: 'POST', body: dbResult});
}
```

In this trivial sync-sample, the fetch() API is only called from outside the transaction. The sample applies also to XMLHttpRequest, jQuery Ajax and any other asynchronic API except the Dexie API.

### Dexie.waitFor()

You can also keep a transaction alive using [Dexie.waitFor()](https://dexie.org/docs/Dexie/Dexie.waitFor()) within a transaction, but I would only recommend it when using definitive short-lived operations, such as the crypto API - and avoid using it on ajax calls as they may take long time to complete - and your transaction would be locked for a long time if so.

### Parallel transactions

It's also OK to run several different database transactions in parallell. Transactions are maintained using [zones](/docs/Promise/Promise.PSD).

#### THIS IS OK:

```javascript
let [drdree, snoopy] = await Promise.all([

    db.transaction('r', db.friends, db.friendAddresses, async () => {
        let friend = await db.friends.get("drdree");
        friend.addresses = await db.friendAddresses
            .where('friendId').equals(friend.id)
            .toArray();

        return friend;
    }),

    db.transaction('r', db.pets, db.friends, () => {
        return db.pets.get("snoopy").then (snoopy => {
            return db.friends.get(snoopy.ownerId).then(owner => {
                snoopy.owner = owner;
                return snoopy;
            });
        });
    })
]);

console.log(JSON.stringify(drdree));
console.log(JSON.stringify(snoopy));
```

*The two transactions can run in parallel. [Zones](/docs/Promise/Promise.PSD) will make sure that each time someone uses a table, it will be invoked using that current transaction of that particular flow of async calls.*

