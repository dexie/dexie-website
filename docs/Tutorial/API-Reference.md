---
layout: docs
title: 'API Reference'
---
### Classes
* [Dexie](Dexie)
* [DexieError](DexieError)
* [Collection](Collection)
* [IndexSpec](IndexSpec)
* [ModifyError](Dexie.ModifyError)
* [Promise](Promise)
* [Table](Table)
* [TableSchema](TableSchema)
* [Transaction](Transaction)
* [Version](Version)
* [WhereClause](WhereClause)

### [Cheat Sheet](#quick-reference)
Jump directly to [Quick Reference](#quick-reference)

### All Methods
[All Pages](_pages)

### Operators & filters
* [WhereClause](WhereClause)
* [Collection](Collection)

### Addons, Adapters and Derived Work
[Derived Work](DerivedWork)

### Typescript
[Using Dexie with Typescript](Typescript)

### Knowledge Base
[Questions and Answers](Questions-and-Answers)

# Quick Reference 

#### Declare Database
```javascript
var db = new Dexie("MyDatabase");
db.version(1).stores({
    friends: "++id, name, age, *tags",
    gameSessions: "id, score"
});

```
#### Schema Syntax

<table>
<tr><td>++</td><td>Auto-incremented primary key</td></tr>
<tr><td>&amp;</td><td>Unique</td></tr>
<tr><td>*</td><td>Multi-entry index</td></tr>
<tr><td>[A+B]</td><td>Compound index</td></tr>
</table>

[Complete Syntax Documentation](Version.stores())

#### Upgrade

```javascript
db.version(1).stores({
    friends: "++id,name,age,*tags",
    gameSessions: "id,score"
});

db.version(2).stores({
    friends: "++id, [firstName+lastName], yearOfBirth, *tags", // Change indexes
    gameSessions: null // Delete table

}).upgrade(function () {
    // Will only be executed if a version below 2 was installed.
    return db.friends.modify(function (friend) {
        friend.firstName = friend.name.split(' ')[0];
        friend.lastName = friend.name.split(' ')[1];
        friend.birthDate = new Date(new Date().getFullYear() - friend.age, 0);
        delete friend.name;
        delete friend.age;
    });
});
```
[Read more about database versioning](Design#database-versioning)

#### Class Binding
```javascript
class Friend {
    // Prototype method
    save() {
        return db.friends.put(this); // Will only save own props.
    }

    // Prototype property
    get age() {
        return moment(Date.now()).diff (this.birthDate, 'years');
    }
}

db.friends.mapToClass(Friend);

```
Reference: [Table.mapToClass()](Table.mapToClass())

#### Add Items

```javascript
db.friends.add({name: "Josephine", age: 21});
```

Reference: [Table.add()](Table.add())

```javascript
db.people.bulkAdd([{name: "Foo"},{name: "Bar"}]);
```

Reference: [Table.bulkAdd()](Table.bulkAdd())


#### Update Items

```javascript
db.friends.put({id: 4, name: "Foo", age: 33});
```

Reference: [Table.put()](Table.put())

```javascript
db.friends.bulkPut([
    {id: 4, name: "Foo2", age: 34},
    {id: 5, name: "Bar2", age: 44}
]);
```

Reference: [Table.bulkPut()](Table.bulkPut())

```javascript
db.friends.update(4, {name: "Bar"});
```

Reference: [Table.update()](Table.update())

```javascript
db.customers
    .where("age")
    .inAnyRange([ [0, 18], [65, Infinity] ])
    .modify({discount: 0.5});
```

Reference: [Collection.modify()](Collection.modify())


#### Delete items

```javascript
db.friends.delete(4);
```

Reference: [Table.delete()](Table.delete())

```javascript
db.friends.bulkDelete([1,2,4]);
```

Reference: [Table.bulkDelete()](Table.bulkDelete())

```javascript
db.logEntries
    .where('timestamp').below(Date.now() - 100000)
    .delete();
```

Reference: [Collection.delete()](Collection.delete())

#### Query Items
```javascript
db.friends
    .where("age").between(20, 25)
    .offset(150)
    .limit(25)
    .toArray()
    .then(function (friends) {
        // 
    });
```

```javascript
db.friends
    .where("name").equalsIgnoreCase("josephine")
    .each(function(friend) {
        console.log("Found Josephine: " + JSON.stringify(friend));
    })
    .then(...);
```

```javascript
db.friends
    .where("name")
    .startsWithAnyOfIgnoreCase(["a", "b", "c"])
    .toArray()
    .then (function (friends) {
        ...
    });
```

References: [Table.where()](Table.where()), [WhereClause](WhereClause), [Collection](Collection)

```javascript
db.friends
    .where('age')
    .inAnyRange([[0,18], [65, Infinity]])
    .modify({discount: 0.5});
```

References: [Table.where()](Table.where()), [WhereClause](WhereClause), [Collection.modify()](Collection.modify())

```javascript
db.friends
    .filter(friend => /a/i.test(friend.name))
    .toArray()
    .then(function (friendsContainingLetterA) {
        ...
    });
```
Reference: [Table.filter()](Table.filter())

```javascript
db.friends
    .where('[firstName+lastName]')
    .equals(["Angela", "Merkel"])
    .first()
    .then(function (forbundskansler) {
        ...
    });
```
[Read more about compound index](Compound Index)

In Dexie 2.0, you could do the above query a little simpler:

```javascript
db.friends.where({
    firstName: "Angela",
    lastName: "Merkel"
}).first().then(function (forbundsKansler) {
    ...
})
```
Or simply:
```javascript
db.friends.get({
    firstName: "Angela",
    lastName: "Merkel"
}).then(function (forbundsKansler) {
    ...
});
```

```javascript
db.friends
    .where('[firstName+lastName]')
    .between([["Angela", ""], ["Angela", "\uffff"])
    .toArray()
    .then(function (angelasSortedByLastName) {
        // This query is equal to:
        //   "select * from friends where firstName='Angela' order by lastName"
    });
```

```javascript
db.friends
    .where('age').above(25)
    .or('shoeSize').below(8)
    .or('interests').anyOf('sports', 'pets', 'cars')
    .modify(friend => friend.tags.push("marketing-target"));
```

Reference: [Collection.or()](Collection.or())

#### Retrieve TOP-X items

```javascript
db.gameSessions
    .orderBy("score")
    .reverse()
    .limit(5)
    .toArray()
    .then(function(sessions) {
        console.log (
            "My 5 top sessions: " +
            sessions.map(function (s) { return s.date }));
    });
```
References: [Table.orderBy()](Table.orderBy()), [Collection.reverse()](Collection.reverse()), [Collection.limit()](Collection.limit())

#### Joining
```javascript
var db = new Dexie('music');
db.version(1).stores({
    genres: '++id,name',
    albums: '++id,name,year,*tracks',
    bands: '++id,name,*albumIds,genreId'
});

function getBandsStartingWithA () {

    // Query
    return db.bands.where('name').startsWith('A').toArray(bands => {
        return Promise.all (bands.map (band =>
          Promise.all([
            db.genres.get (band.genreId),
            db.albums.where('id').anyOf(band.albumIds).toArray()
          ]).then (result => {
            // Set genre and albums as direct properties on each result
            [band.genre, band.albums] = result;
            return band;
          });
        ));
    });
}
```

#### Yielding Promises

[spawn()](Dexie.spawn())
```javascript
Dexie.spawn(function*() {

    var id = yield db.friends.add({name: 'Simon', age: 3});
    console.log("Simon got id: " + id);

    var oldFriends = yield db.friends.where('age').above(75).toArray();
    console.log("Old friends: " + oldFriends.map(f => f.name));

    // Give a dog to all friends over 8 years old:
    var addedPetIds = yield db.transaction('rw', db.friends, function* () {
        // Get primary keys to all friends that should get a dog:
        var primaryKeys = yield db.friends.where('age').above(8).primaryKeys();
        return yield Dexie.Promise.all(
            // Add a new dog and set its foreign key to the friend in question.
            primaryKeys.map(friendId => db.pets.add({kind: 'dog', ownerId: friendId})
        );
    });

}).catch (function (err) {
    console.error (err.stack);
});
```

[async()](Dexie.async())
```javascript
var birthday = Dexie.async(function* (friendId) {
    yield db.friends
        .where('id')
        .equals(friendId)
        .modify(friend => {
            friend.age++;
        });
});

birthDay(2).catch(err => console.error(err.stack));

```

#### Ongoing Transaction

```javascript
function goodFriends() {
    return db.friends
        .where('tags')
        .equals('close-friend');
}

function addComment(friendId, comment) {
    return db.friends
        .where('id')
        .equals(friendId)
        .modify(friend => {
            friend.comments.push(comment);
        });
}

function spreadYourLove() {
    // Make an atomic change:
    return db.transaction('rw', db.friends, function* () {
        var goodFriendKeys = yield goodFriends().primaryKeys();
        yield Dexie.Promise.all(
            goodFriendKeys.map(id => addComment(id, "I like you!"))
        );
    });
}

```

*The above code snippet shows that you can reuse "transactionless" code (function goodFriends() and addComment()) but execute it within a transaction (spreadYourLove()).*

Reference: [Dexie.transaction()](Dexie.transaction())

#### Parent Transaction

```javascript
// Make one large atomic change that calls other
// functions that already use a transaction.
db.transaction('rw', db.friends, db.diary, function*() {
    yield spreadYourLove();
    yield db.diary.log({date: Date.now(), text: "Today I successfully spread my love"});
}).catch (err => {
    console.error ("I failed to spread my love :( " + err.stack);
});

```
*The above snippet shows that you can also reuse code that is indeed transaction-aware, but encapsulate several such functions in an overall umbrella-transaction.*

Reference: [Dexie.transaction()](Dexie.transaction())

#### Working with Asynchronic APIs
Dexie.js is an asynchronic API. In synchronic APIs, errors are normally handled using exceptions. This is very convinient because you code on without doing error checking everywhere and instead catch exceptions on a higher level. Asynchronic APIs normally use success- and error events to signal back when operation complete. Since indexedDB uses a combination of exceptions and error events to notify the caller, it is quite cumbersome to code against it using correct error handling - you need both to do try..catch and request.onerror for each and every request. Dexie.js solves this by working with ECMAScript6 compliant [Promises](http://www.html5rocks.com/en/tutorials/es6/promises/) making error handling as easy as it is on a synchronous API with try..catch error handling.

#### Working with Promises
Promise based APIs (such as Dexie.js) will look more like synchronous APIs than event based APIs, but instead of returning the result, it will return an instance of [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise). ECMAScript6 promises has two methods: [then()](Promise.then) and [catch()](Promise.catch). These methods expects a callback to call when the operation succeeds or fails respectively. All asynchronic methods in Dexie returns a Promise instance and this makes the API way more easy to use, as you will see in our examples.

#### Promise Compatibility
Dexie Promises are A+ / ES6 compliant and play magically well with other Promise libraries, such as bluebird, Q or native Promise. It can be used in async / await code in Typescript or ES7. However, it is important to stick to only using `Dexie.Promise` (in Dexie 1.x) while doing operations within a transaction. Otherwise the underlying transaction will commit too early due to a limitation within indexedDB itself. However, the final result of the transaction (final Promise returned by db.transaction()) can be safely mixed with or converted to any other Promise lib.

*In Dexie 2.0.0-beta and later, the global Promise can be safely used within transactions as the global Promise will be patched within the transaction [zone](Promise.PSD).*

#### Promise-Specific Data (zone)
Dexie Promises supports a pattern similar to [Thread-local storage](http://en.wikipedia.org/wiki/Thread-local_storage) where it is possible to have static properties that is bound to the executing promise and all it's child-promises. This is similar Angular's [zone.js](https://github.com/angular/zone.js/) but only for Promises and without having to modify globals. Dexie.js and it's transaction API heavily depends on it since it enables code to be aware of the currently executing transaction without having to pass transaction objects around. [Promise-Specific Data doc](Promise.PSD).

#### Exception Handling
With Dexie, in contrary to indexedDB, there is one single way to catch exceptions - through the Promise.catch() method. Nowhere do you need to do a standard try..catch(). The reason for this is to not enforce the caller to need to think about several ways of error handling. When you work with transactions, you will also get the benefit of being able to catch all errors in one single place - at the end of the transaction, instead of having to catch() every promise of each database operation. Any uncatuch error (no matter error events, exception or miss-spelled variable in your code) will abort the ongoing [Transaction](Transaction) and trigger its returned [Promise](Promise) to reject, waking up any catch() clause attached to the transaction scope.

```javascript
db.transaction('rw', db.friends, function() {

    ...

    window.MissSpelledVar.NonExistingVar = 3; // Will fail!

}).catch (function (err) {

    // Transaction will abort!
    console.error(err);

});
```

All transaction promises should either be catched or returned to its caller. If this pattern isn't followed, [Promise.on('error')](Promise.on.error) will trigger. 

```javascript
Dexie.Promise.on('error', function (err) {
    // Catch all uncatched DB-related errors and exceptions
    console.error(err);
});
```

#### Catching means Handling!
If you catch a Promise from a database operation within a transaction, it will be considered to be handled and the transaction will not be aborted. This could be a common pitfall when people catch promises within transactions just to log  it but expecting the transaction to abort. Solution: re-throw the errors that you don't handle!

```javascript
db.transaction('rw', db.friends, function() {

    db.friends.add({id: 1, name: "Foo"}).catch(function(e) {
        console.error("Failed to add Foo friend");
        throw e; // Rethrow to abort transaction.
    });

})
```

#### Working With Transactions
Whenever you want to do more than a single operation, you simplify your code by using transactions. By working with transactions, you get the following benefits:
* If modifying database and any error occur - error event or exception of any kind - then transaction will abort and every modification will be rolled back.
* No need to handle promises if you don't like. Everything is encapsulated in the transaction so you can handle that instead.
* You may do all write operations synchronically without the need to wait for it to finish before starting the next one. (see the 2nd example code below).
* Even read-operations can be done the line after a write operations without waiting for write to finish - still your result will include all modifications. This is possible because all operations are queued when there is a pending write operation going on in current transaction.
* Not a single error will just slip away - you catch all in the final catch() method - both error events and ordinary exceptions of any kind.

Here is how you enter a transaction block:

```javascript
db.transaction('rw', db.friends, db.pets, function () {
    // Any database error event that occur will abort transaction and
    // be sent to the catch() method below.
    // The exact same rule if any exception is thrown what so ever.

    return db.pets.add({name: 'Bamse', kind: 'cat'}).then(function (petId) {
        return db.friends.add({name: 'Kate', age: 89, pets: [petId]});
    });

}).catch(function (error) {
    // Log or display the error

    console.error (error.stack || error);

});
```
Notes:
* 'friends' and 'pets' are objectStores registered using [Version.stores()](Version.stores()) method.
* `"rw"` should be replaced with `"r"` if you are just going to do read operations.
* Also errors from chained database operations within the transaction, or plain exceptions happening in any then() callback of any chained operation will be catched by the transaction's catch() method.
* It is possible to prohibit the transaction from being aborted if a failing DB operation is catched explicitely:

```javascript
db.transaction('rw', db.friends, function() {
    db.friends.add({id:1, name:"Fredrik"});
    db.friends.add({id:1, name:"Fredrik"}).catch(function (err) {
        // Adding same primary key twice will of course fail. But
        // since we catch this error explicitely, the transaction
        // wont abort. This makes it possible to continue the
        // transaction in a managed way. If you still want to abort
        // the transaction, just do Dexie.currentTransaction.abort(),
        // throw an exception, or just:
        // return Dexie.Promise.reject(err);
    });
}).then (function () {
    alert ("Transaction successfully completed");
});
```

When working with transactions, you may query a recent add(), put(), update(), delete() or modify() operation on the next line without waiting for it to finish. The waiting is taken care of by the framework. See the difference below on how that may simplify your code to work with a transaction and not having to call .then() all the time.

##### Code Example Without Transaction
```javascript
db.friends.add({ name: "Ulla Bella", age: 87, isCloseFriend: 0 }).then(function () {

    return db.friends.add({ name: "Elna", age: 99, isCloseFriend: 1 });

}).then(function (){

    return db.friends.where("age").above(65).each(function (friend) {
        console.log("Retired friend: " + friend.name);
    });

}).catch(function (error) {

    console.error(error);

})
```

##### Same Code Example With Transaction
```javascript
db.transaction("rw", db.friends, function () {

    db.friends.add({ name: "Ulla Bella", age: 87, isCloseFriend: 0 });
    db.friends.add({ name: "Elna", age: 99, isCloseFriend: 1 });
    db.friends.where("age").above(65).each(function (friend) {
        console.log("Retired friend: " + friend.name);
    });

}).catch(function (error) {

    console.error(error);

});
```

The sample above shows that there's no need to wait for the add() operations to finish when working within the same transaction.

#### The Auto-Commit Behavior of IndexedDB Transactions

IndexedDB will commit a transaction as soon as it isn't used within the same task. This means that you MUST NOT call any other async API (at least not wait for it to finish) within a transaction scope. If you do, you will get a TransactionInactiveError thrown at you as soon as you try to continue using the transaction. This cannot be worked around by encapsulating the call with Dexie.Promise since it is a behaviour of IndexedDB.

*News in Dexie 2.0.0-beta.6: You can now wait for other async APIs and still hold the transaction active, using [Dexie.waitFor()](Dexie.waitFor())*

#### Nested IndexedDB Transactions

Since version 0.9.8, Dexie supports nested transactions:

```javascript
db.transaction('rw', db.friends, db.pets, function () {
    // MAIN transaction block
    db.transaction('rw', db.pets, function () {
       // SUB transaction block
    });
});
```

The power with nested transactions is that functions that use a transaction can be reused by higher-level code that surrounds all of its calls into a bigger transaction.

See also [Dexie.transaction()](Dexie.transaction()) for more information on how to use transactions.
