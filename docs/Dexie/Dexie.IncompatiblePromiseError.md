---
layout: docs
title: 'Dexie.IncompatiblePromiseError'
---

### Inheritance Hierarchy

* [Error](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
  * [Dexie.DexieError](DexieError)
    * Dexie.IncompatiblePromiseError

### Description 
*Obsolete since Dexie 2.0.0*

**This error is removed in Dexie v2.x because from that version and forward, native promises are accepted to return from a transaction scope.**

Happens only in Dexie v1.x when returning an incompatible Promise from a transaction scope. You need to verify that you are only using Dexie.Promises for all async code withing any transaction scope.

Dexie.Promises are compatible with other Promises, but in transaction scopes you must use Dexie.Promise only. Outside transaction scopes, you are free to mix with other promises. The reason is that Dexie's transaction scope needs to do the following:

* Make sure indexedDB transactions aren't committed too early
* Keep track of currently ongoing transaction for the particular scope.
* Detect whether a promise was uncaught and if so, abort the transaction.

### Solution:

Don't do:

```javascript
db.transaction ('rw', db.friends, function() {
    return Promise.all ([ // Promise.all() doesn't work.
        db.friends.put({name: "Foo"}),
        db.friends.put({name: "Bar"})
    ]);
});

```

Instead, do:

```javascript

db.transaction ('rw', db.friends, function() {
    return Dexie.Promise.all ([  // Always use Dexie.Promise in transaction scopes
        db.friends.put({name: "Foo"}),
        db.friends.put({name: "Bar"})
    ]);
});

```

### Solution for async / await

Due to the incompability between indexedDB and native Promise, async / await should be avoided in all cases where there might be
an overall transaction. Instead, use Dexie.spawn()/yield.

```javascript
import Dexie from 'dexie';

function putFriends() {
    return Dexie.spawn(()=> {
        yield db.transaction('rw', db.friends, function* () {
            yield db.friends.put({name: "Foo"});
            yield db.friends.put({name: "Bar"});
        });
    });
});

```

The resulting Promise CAN be awaited using await, but it will make any ongoing transaction fire off.

