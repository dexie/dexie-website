---
layout: docs
title: 'Dexie.transaction()'
---

### Syntax

```javascript
db.transaction(mode, table(s), function() {

    //
    // Transaction Scope
    //

}).then(function(result) {

    //
    // Transaction Committed
    //

}).catch(function(error) {

    //
    // Transaction Failed
    //

});
```

### Parameters

<table>
<tr><td>mode</td><td>
<dl>
  <dt>"rw"</dt><dd>READWRITE</dd>
  <dt>"r"</dt><dd>READONLY</dd>
  <dt>"rw!","rw?","r!" or "r?"</dt><dd>Specify how to behave when there already is an ongoing transaction. See <a href="#specify-reusage-of-parent-transaction">Specify Reusage of Parent Transaction</a></dd>
</dl></td></tr>
<tr><td>table(s)</td><td>Table instances or table names to include in transaction. You may either provide multiple arguments after each other, or you may provide an array of tables. Each argument or array item must be either a <a href="/docs/Table/Table">Table</a> instance or a string.</td></tr>
<tr><td>callback</td><td>Function to execute with the transaction. Note that since number of arguments may vary, the callback argument will always be the last argument provided to this method.</td></tr>
</table>

### Sample

```javascript
db.transaction('rw', db.friends, db.pets, function() {

    //
    // Transaction Scope
    //

    db.friends.add({name: "New Friend"});
    db.pets.add({name: "New Pet", kind: "snake"});

}).then(function() {

    //
    // Transaction Complete
    //

    console.log("Transaction committed");

}).catch(function(err) {

    //
    // Transaction Failed
    //

    console.error(err.stack);
});
```

### Return Value

[Promise](/docs/Promise/Promise) that will resolve when the transaction has committed. It will resolve with the return value of the callback (if any). If transaction fails or is aborted, the promise will reject.

### Description

Start a database transaction.

When accessing the database within the given scope function, any [Table](/docs/Table/Table)-based operation will execute within the current transaction.

*NOTE: As of v1.4.0+, the scope function will always be executed asynchronically. In previous versions, the scope function could be executed either directly (synchronically) or asynchronically depending on whether the database was ready, or if a parent transaction was locked. See [Issue #268](https://github.com/dfahlander/Dexie.js/issues/268)*.

### Transaction Scope

The Transaction Scope is the places in your code where your transaction remains active. I'll sometimes refer to it as the Transaction [*Zone*](/docs/Promise/Promise.PSD). The obvious scope is of course your callback function to the transaction() method, but the scope will also extend to every callback (such as then(), each(), toArray(), ...) originated from any database operation. Here are some samples that clarifies the scope:

```javascript
db.transaction('r', db.friends, db.pets, function() {

    // WITHIN SCOPE / ZONE!

    db.friends.where('name').equals('David').first(function(friend) {

        // WITHIN SCOPE / ZONE!

        db.pets.where('daddy').anyOf(friend.pets).each(function(pet) {
            
            // WITHIN SCOPE / ZONE!

        });
    });

    setTimeout(function() {

        // NOT WITHIN ZONE! (because Dexie's zone system does not support setTimeout())

    }, 0);

}).then(function() {

    // Transaction committed. NOT WITHIN ZONE!

}).catch(function(err) {

    // Transaction aborted. NOT WITHIN ZONE!

});
```

If you call another function, it will also be executing in the current transaction zone:

```javascript
    db.transaction('rw', db.friends, function () {
        externalFunction();
    });

    function externalFunction () {
        db.friends.add({name: "my friend"}); // WITHIN ZONE!
    }
```

_**BUT**_ be aware that zone is lost if using non-indexedDB compatible Promises (like standard Promise):

```javascript
let Bluebird = require('bluebird');
db.transaction('rw', db.cars, function () {
    //
    // Transaction block
    //
    return db.cars.put({id: 3}).then (function() {
        // Avoid returning other kinds of promises here:
        return new Bluebird(function(resolve, reject){
            resolve();
        });
    }).then(function() {
        // You'll be outside the zone here, unless you use Dexie.Promise or window.Promise.
        return db.cars.get(3);
    });
}); // Transaction will fail with 'PrematureCommitError' (as of Dexie 2.0.0)
```

so make sure to only use Dexie.Promise within a transaction zone. In Dexie 2.0, it's ok to use the global Promise within transaction zones, because it is patched for transaction-safety within the zone.

### The Auto-Commit Behavior of IndexedDB Transactions

IndexedDB will commit a transaction as soon as it isn't used within a tick. This means that you MUST NOT call any other async API (at least not wait for it to finish) within a transaction scope. If you do, you will get a TransactionInactiveError thrown at you. This cannot be worked around by encapsulating the call with Dexie.Promise.

### Accessing Transaction Object

As long as you are within the transaction zone, the [Transaction](/docs/Transaction/Transaction) object is returned using the [Dexie.currentTransaction](/docs/Dexie/Dexie.currentTransaction) [Promise-static](/docs/Promise/Promise.PSD) property.

### Nested Transactions

Dexie supports nested transactions. A nested transaction must be in a compatible mode as its main transaction and all tables included in the nested transaction must also be included in its main transaction. Otherwise it will return a rejected promise and abort the parent transaction.

```javascript
db.transaction('rw', db.friends, db.pets, db.cars, function () {

    // MAIN TRANSACTION ZONE

    db.transaction('rw', db.friends, db.cars, function () {

        // SUB TRANSACTION ZONE

        db.transaction('r', db.friends, function () {

            // SUB- of SUB-TRANSACTION ZONE

        });
    });
});
```

#### Limitations with Nested Transactions

Rollback support in nested transactions rely on the rollback support of the parent transaction; If a nested transaction fails, parent transaction will also fail. Normally, this is just fine and exactly what you would want to happen. But just  don't expect to prohibit parent from failing by catching the nested transaction. See sample:

```javascript

// Topmost transaction:
db.transaction('rw', db.friends, function() {

    // Sub transaction:
    db.transaction('rw', db.friends, function () {

        db.friends.add({id: 1})
            .catch(function (err) {
                // This catch() would successfully prohibit abort from happening.
            });

        ...

        db.friends.add({id: 1}); // will reject...

    }).catch (function (err) {
        // Catching sub-transaction promise.
        // This will NOT prohibit parent transaction from aborting.
    });

}).then(function () {

}).catch(function (err) {
    // Transaction Failed!
});
```

#### The Beauty of Nested Transactions

If you write a library function that does some DB operations within a transaction and then need to reuse that function from a higher level library function, combining it with other tasks, you may gain atomicity for the entire operation. Without nested transactions, you would have to split the operations into several transactions, resulting in the risk of losing data integrity.

##### Sample

```javascript
// Lower-level function
function birthday(friendName) {
    db.transaction('rw', db.friends, function () {
        db.friends.where('name').equals(friendName).first(function (friend) {
            ++friend.age;
            db.friends.put(friend);
        });
    });
}

// Higher-level function
function birthdays(today) {
    db.transaction('rw', db.friends, function() {
        db.friends.where('birthdate').equals(today).each(function (friend) {
            birthday(friend.name);
        });
    });
}
```

_Note: The above samples are quite stupid, but samplifies the goodie with nested transactions. If you really wanted to do the above code simpler, you would do_

```javascript
function birthday (friendName) {
    db.friends
      .where('name')
      .equals(friendName)
      .modify(function(friend) {
        ++friend.age;
    });
}
```

_...but that wouldnt visualize the beauty of nested transactions..._

### Creating Code With Reusable Transaction

Let's assume you have a javascript class Car with the method `save()`.

```javascript
function Car (brand, carModel) {
    this.brand = brand;
    this.model = carModel;
}

Car.prototype.save = function () {
    return db.cars.put(this);
}
```

In a transaction-less code block you could then do:

```javascript
var car = new Car ("Pegeut", "Van Range");
car.save();
```

If you call save() from within a transaction block:

```javascript
db.transaction('rw', db.friends, db.pets, db.cars, function () {
    var car = new Car ("Pegeut", "Van Range");
    car.save();
});
```

... then the save method will run the put() operation within your transaction scope. It is quite convenient not having to pass transaction instances around your code - that would easily bloat up the code and make it less reusable. It also makes it easier to switch from non-transactional to transactional code.

When you write your transaction scope, you must make sure to include all tables that will be needed by the functions you are calling. If you forget to include a table required by a function, the operation will fail and so will the transaction.

```javascript
db.transaction('rw', db.friends, function() {
    var car = new Car ("Pegeut", "Van Range");
    car.save(); 
}).catch (function (err) {
    // Will fail with Error ("Table cars not included in parent transaction")
});
```

### Specify Reusage of Parent Transaction

When entering a nested transaction block, Dexie will first check that it is compatible with the currently ongoing transaction ("parent transaction"). All store names from nested must be present in parent and if nested is "rw" (READWRITE), the parent must also be that.

The default behavior is to fail with rejection of the transaction promises (both main and nested) if the two are incompatible. 

If your code must be independent on any ongoing transaction, you can override this by adding "!" or "?" to the `mode` argument.

```javascript
db.transaction("rw!", db.Table, function () {
    // Require top-level transaction (ignore ongoing transaction)
});

db.transaction("rw?", db.Table, function () {
    // Use nested transaction only if compatible with ongoing, otherwise
    // launch a top-level transaction for this scope
});
```

<dl>
  <dt>!</dt><dd>Force Top-level Transaction. This will make your code independant on any ongoing transaction and instead always spawn a new transaction at top-level scope.</dd>
  <dt>?</dt><dd>Reuse parent transaction only if they are compatible, otherwise launch a top-level transaction.</dd>
</dl>

The "!" postfix should typically be used on a high-level API where the callers are totally unaware of how you are storing your data.

The "?" postfix can be used when your API could be used both internally or externally and you want to take advantage of transaction reusage whenever it is possible.

### Sample Using The "!" Postfix

Assume you have an external "Logger" component that is independent on anything else except db and the "logentries" table. Users of the Logger component should not have to worry about how it is implemented or whether a specific table or mode must be used in an ongoing transaction. In those kind of scenarios it is recommended to use a transaction block with the "!" postfix as the following sample shows.

```javascript
//
// "logger.js":
//
function Logger() {
  this.log = function (message) {
          // Use the "!" postfix to ensure we work with our own transaction and never
          // reuse any ongoing transaction.
    return db.transaction('rw!', db.logentries, function () {
      db.logentries.add({message: message, date: new Date()});
    });
  }
}

//
// Application code:
//
var logger = new Logger();

db.transaction('rw', db.friends, function () {
  logger.log("Now adding hillary...");
  return db.friends.add({name: "Hillary"}).then(function() {
    logger.log("Hillary was added");
  });
}).then(function() {
  logger.log("Transaction successfully committed");
});
```

Since the logger component must work independently of whether a transaction is active or not, the logger component must be using the "!" postfix. Otherwise it would fail whenever called from within a transaction scope that did not include the "logentries" table.

Note: This is just a theoretical sample to explain the "!" postfix. In a real world scenario, I would rather recommend to have a dedicated Dexie instance (dedicated db) for logging purpose rather than having it as a table within your app code. In that case you wouldn't have to use the "!" postfix because only you logging component would know about the db and there would never be ongoing transactions for that db.

### Implementation Details of Nested Transactions

Nested transactions has no out-of-the-box support in IndexedDB. Dexie emulates it by reusing the parent IDBTransaction within a new Dexie Transaction object with reference count of ongoing requests. The nested transaction will also block any operations made on parent transaction until nested transaction "commits". The nested transaction will "commit" when there are no more ongoing requests on it (exactly as IDB works for main transactions). The "commit" of a nested transaction only means that the tranction Promise will resolve and any pending operations on the main transaction can resume. An error occuring in the parent transaction after a "commit" will still abort the entire transaction including the nested transaction.

### Parallell Transactions

At a glance, it could seem like you could only be able to run one transaction at a time. However, that is not the case. [Dexie.currentTransaction](/docs/Dexie/Dexie.currentTransaction) is a [Promise-Local](/docs/Promise/Promise.PSD) static property (similar to how Thread-local storage works in threaded environments) that makes sure to always return the [Transaction](/docs/Transaction/Transaction) instance that is bound to the transaction scope that initiated the operation.

#### Spawning a parallell operation

Once you have entered a transaction, any database operation done in the transaction will reuse the same transaction. If you want to explicitely spawn another top-level transaction from within your current scope, you could either add the "!" postfix to the mode, or use encapsulate the database operation with [Dexie.ignoreTransaction()](/docs/Dexie/Dexie.ignoreTransaction()).

```javascript
db.transaction('rw', db.friends, function () {
    // Use Dexie.ignoreTransaction() to launch a parallell
    // transaction from within your current transaction.
    db.transaction('r!', db.pets, function() {
        // This transaction will run in parallell because using the "!" postfix.
    }).catch(...);

    // Spawn a transaction-less operation outside our transaction:
    Dexie.ignoreTransaction(function () {
        // Will launch in parallell due to Dexie.ignoreTransaction()
        db.pets.toArray(function (){}).catch(...);
    });
});
```

### Parallel Operations Within Same Transaction

Database operations are launched in parallel by default unless you wait for the previous operation to finish.

Sample:

```javascript
function logCarModels() {
    return db.transaction('r', db.cars, function() {
        db.cars
          .where('brand')
          .equals('Volvo')
          .each(function (car) {
            console.log("Volvo " + car.model);
        });
    
        db.cars
          .where('brand')
          .equals('Peugeot')
          .each(function (car) {
            console.log("Peugeot " + car.model);
        });
    });
}
```

The above operations will run in parallel even though they run withing the same transaction. So you will get a mixture of Volvos and Peugeots scrambled around in your console log.

To make sure that stuff happends in a sequence, you would have to write something like the following:

```javascript
// 1. Log Volvos
db.cars
  .where('brand')
  .equals('Volvo')
  .each(function (car) {
      console.log("Volvo " + car.model);
  }).then (function() {
      // 2. Log Pegeuts
      return db.cars
        .where('brand')
        .equals('Peugeot')
        .each(function (car) {
            console.log("Peugeot " + car.model);
        });
  }).then (function (){
      // 3. Do something more...
  }).catch (function (e) {
      ...
  });
```

The example above shows how to run your queries in a sequence and wait for each one to finish. 

### Async and Await

Async functions can be used with Dexie with the following caveats:

* Natively supported only by latest versions of Chrome and Edge and only if turning on experimental javascript features.
* Some quirks and but's when using Dexie version 1.x, see below:

#### Dexie 1.x

* Need to set `let Promise = Dexie.Promise` at the same level as the async function is defined. Only works with Typescript < v2.0 and older versions of babel.

#### Dexie 2.x

You can use async await without any quirks. It works perfectly well with both native async functions (possible to enable in Edge and Chrome) as well as transpiled async await (Typescript - any version, Babel - any version). For transpiled async await, the end code will survive indexedDB transactions no matter browser (including IE 10). However, when using native async await, the browser will invoke native promises instead of Dexie.Promise. This would break transactions in Safari, IE and Firefox. Luckily though, Edge and Chrome are the only one supporting native async functions and both of them also have compatibility between their indexedDB implementation and their native promises. Dexie can maintain its zones (holding current transaction) between native await expressions as well as between transpiled await expressions.
 
```javascript
await db.transaction('rw', db.friends, async function() {
    let friendId = await db.friends.add({name: "New Friend"});
    let petId = await db.pets.add({name: "New Pet", kind: "snake"});
    //...
});
```

The above code works with Dexie v2.0.0 in Typescript or babel with ES2016 preset. Also works in natively in Chrome and Edge when turning on experimental javascript features.

#### Spawn / yield

This is a poor-man's alternative to async functions but it is more widely supported by today's browsers:

* Safari 10
* Edge
* Chrome
* Opera
* Firefox

All these browsers support the `yield` keyword natively, so you can use it without any transpiling step:

```javascript
db.transaction('rw', db.friends, function*() {
    var friendId = yield db.friends.add({name: "New Friend"});
    var petId = yield db.pets.add({name: "New Pet", kind: "snake"});
    //...    
});
```

Read more about this in [Simplify with yield](/docs/Simplify-with-yield)
