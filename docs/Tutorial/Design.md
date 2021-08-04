---
layout: docs
title: 'Design'
---

### The Dexie class

Dexie is both a class and a namespace. An instance of Dexie will represent a database connection. As namespace, it is used as an export area for functions, utilities, and classes. In a simple HTML browser environment this means that including "Dexie.js" will only add one property to window: window.Dexie. If you are utilizing a module environment like commonjs or ES modules, Dexie will be the default export that you get when requiring it. Here's an example how to use Dexie once you've included it:

```javascript
import Dexie from 'dexie';

// Create your instance
var db = new Dexie("MyDatabase"); 

// Define your schema
db.version(1).stores({
    myObjectStore1: "primaryKey, index1, index2, ...",
    myObjectStore2: "primaryKey, index1, index2, ...",
    ...
});

// Open the database
db.open().catch(function (e) {
    console.error("Open failed: " + e);
});
```

Dexie, as its backend indexedDB implementation, is an asynchronous database, meaning that any operation that requires a result won't be returned directly. Instead all such operations will return a [Promise](http://www.html5rocks.com/en/tutorials/es6/promises/).

Dexie also supports queuing operations, meaning you can start using the database directly after having defined it. In case open() hasn't been called, it will open it automatically and enqueue the operation to execute as soon as the database is finished opening. If open fails, queued operations will immediately fail with the error event from the open request.

Notice also that you don't need to care for whether the database has been created or not. It all be created automatically first time use. You always define your schema and let the runtime decide whether to use that definition for creating the database or just for populating the table properties onto your db instance. 

### The Table Class

[Table](/docs/Table/Table) represents an object store. On your Dexie instance you will have direct access to instances of Table for each object store you have [defined in your schema](/docs/Version/Version.stores()).

```javascript
var db = new Dexie("FriendsAndPetsDB");

db.version(1).stores({
    friends: "++id,name,isCloseFriend",
    pets: "++id,name,kind"
});
db.open();
db.friends.add({name: "Ingemar Bergman", isCloseFriend: 0});
db.pets.add({name: "Josephina", kind: "dog", fur: "too long right now"});
```

_Note: `++id` (or `id++`) on the primary key means that it will be auto-incremented_
_Note2: You only need to specify properties that you wish to index. The object store will allow any properties on your stored objects but you can only query them by indexed properties_

As you can see, `db.friends` and `db.pets` are instances of [Table](/docs/Table/Table) that you can operate on directly.

[Table](/docs/Table/Table) is the entry point for doing all operations to your object stores, such as querying, adding, putting, deleting, clearing and modifying your data.

### Transactions

Whenever you are going to do more than a single operation on your database in a sequence, you would normally use a transaction. [Transaction](/docs/Transaction/Transaction) represents a full [ACID](http://en.wikipedia.org/wiki/ACID) transaction. When working with transactions you get the following benefits:

* If modifying a database and an error occurs, every modification will be rolled back.
* You may do all write operations synchronously without the need to wait for it to finish before starting the next one.
* You may catch any error event or exception of any kind in one single catch() method of the transaction, making sure no exception what so ever will make your app just stall. Even "runtime" exceptions like the use of a misspelled variable will be caught even if it happens in the _callback of a callback_ of your transaction callback...
* Remember that a browser can close down at any moment. Think about what would happen if the user closes the browser somewhere between your operations. Would that lead to an invalid state? If so, use a transaction - that will make its operations abort if browser is closed between operations.

Here is how you enter a transaction block:

```javascript
db.transaction("rw", db.friends, db.pets, function() {
    // Any database error event that occur will abort transaction and be sent to
    // the catch() method below.
    // The exact same rule if any exception is thrown whatsoever.
}).catch(function (error) {
    // Log or display the error
});
```

Notes:
* 'friends' and 'pets' are objectStores registered using the [version()](/docs/Dexie/Dexie.version()) method.
* Replace `"rw"` with `"r"` if you are just going to read from the stores.
* Also errors occurring in nested callbacks in the block will be catched by the catch() method.
* It is also possible to prohibit the transaction from being aborted by [catching](/docs/Promise/Promise.catch) specific errors. (See [Dexie.transaction()](/docs/Dexie/Dexie.transaction()) ).

#### Transaction Lifetime

A transaction is auto-committed once you do not do anything with it. So, if you do `setTimeout(cb, 0)` anywhere, don't expect your transaction to live when the callback comes back! The only way of keeping a transaction alive between ticks is to perform a database operation on it. Then it will live until that operation fails (catch()) or succeeds (then()). You can then do another operation to keep it alive some more time, etc. There might be situations where you would interact with other async APIs within a transaction (WebCrypto, fetch, $.ajax, etc). In that situation, it is often better to think twice if you should keep the transaction ongoing through the other async call. If you however decide that you need this, there's a new method in Dexie v2: Dexie.waitFor() that may keep the current transaction
alive until given Promise is fulfilled. See [Dexie.waitFor()](/docs/Dexie/Dexie.waitFor()).

There is no commit() method on transactions, because it is not needed since it will auto-commit if no errors occur. You can abort() it however.

### Database Versioning

Thanks to the backend architecture of indexedDB, database versioning is essential when working with indexedDB. With Dexie, you get an even easier upgrading framework built upon the indexedDB framework.

Lets say you initially have the following database schema:

```javascript
var db = new Dexie("FriendsDB");
db.version(1).stores({friends: "++id,name"});
```

This schema only specifies a primary key "id" that is auto-incremented, and an index on the property "name". Your app may store other properties as well, such as `phone`, `email` etc but it will not be indexed:

```javascript
db.friends.put({
    name: "Arnold",
    phone: "123456",
    email: "arnold@abc.com",
    shoeSize: 88
});
```

Let's say that you publish your app and people start using it. After a while, your user requests a new feature - to be able to search for friends with a certain shoeSize. But you have not indexed shoeSize in your schema, so how do you add that index to the next version of your app? Here's how:

In Dexie &gt;= 3.0:
* Just increase the version number and add shoeSize along the indexes:
  ```js
  db.version(2).stores({friends: "++id,name,shoeSize"});
  ```

In Dexie &lt; 3.0:
1. Keep the line `db.version(1).stores({friends: "++id,name"});` - **Never touch it as long as there are users out there with that version running!**
2. Instead, add a new line to your code: `db.version(2).stores({friends: "++id,name,shoeSize"});`.

Voila, that's it. Your code can now do stuff like db.friends.where('shoeSize').between(37,39), which would fail in version 1.

OK, that's nice. But what if you'd need to change the **data architecture**? Let's say you want to split `name` into `firstName` and `lastName` and index those separate. Here's how you do it. (This time I present the entire code containing all versions, so you can see it in it's whole):

```javascript
var db = new Dexie("FriendsDB");
db.version(1).stores({friends: "++id,name"});
db.version(2).stores({friends: "++id,name,shoeSize"});
db.version(3).stores({friends: "++id,shoeSize,firstName,lastName"}).upgrade(tx => {
    // An upgrade function for version 3 will upgrade data based on version 2.
    return tx.table("friends").toCollection().modify(friend => {
        // Modify each friend:
        friend.firstName = friend.name.split(' ')[0];
        friend.lastName = friend.name.split(' ')[1];
        delete friend.name;
    });
});
```

That's it. Your data will automatically upgrade for existing users. A version with an upgrader attached must never be altered. Further changes to the schema should be done by adding a new version declaration before or after the existing one (order doesn't matter). This holds true for both Dexie 3.0 and older versions.

So what are the rules to be aware of?

* Dexie &lt;3: Keep old versions as long as there are code out there with them installed.
* Dexie &gt;=3: You only need to keep versions that have an upgrader as long as there are code out there that use a version lower than the upgrader-attached version.
* Create/drop/alter indexes or tables by adding a new `version(x)` with an updated `stores({...})` spec. If you are on Dexie &gt;=3 you can just increase the version number of existing declaration and modify the tables and indexes of it.
* Tables are not deleted unless you specify `null` as the stores-specification for that table in a new version.
* New versions need only to specify changed tables.

Important to notice is that in case you got 50 tables and just need to add an index on one of them, you don't need to repeat all tables again in the new version-spec. Just specify an updated version of the table you need to alter. Indexes work differently though - they are dropped as soon as you don't specify them in a new versions.

```javascript
db.version(1).stores({
    foo1: 'id,x,y,z',
    foo2: 'id,x,y,z',
    foo3: 'id,x,y,z'
});
// Delete index 'y' on 'foo1':
db.version(2).stores({
    foo1: 'id,x,z'
});
// Add index 'x2' on 'foo2':
db.version(3).stores({
    foo2: 'id, x, x2, y, z'
});
// Drop table 'foo3':
db.version(4).stores({foo3: null});
```

The order of provided versions is not crucial. You may begin with the last version if you like. Dexie will sort the versions before opening the db and regard the max version provided as the target version.

Description of the open / upgrade sequence:

1. User code calls db.open();
2. If database is not present, or an earlier version was present, indexedDB's `onupgradeneeded` event is fired and taken care of by Dexie.
3. Dexie inspects what version is currently used. If no database present, Dexie initializes the last version directly by parsing the stores schema syntax and adding stores and indexes accordingly. No upgrade() functions run in this case.
4. If a previous version is installed, Dexie will filter out the diff between each version and add/remove stores and indexes sequentially. So also with any registered upgrader function. A new feature in Dexie 3 is that it relies on the installed schema rather than the declared, so the diff will be computed between the actual installed schema and the next version rather than the declared schema of the current version and next version. This means two things: First of all that if the declaration of current schema is not in sync with the actual, it does not matter. Second, that Dexie can open a new version from on a device with an old version installed also when the old version is not present in the declaration.

Error handling: If any error occur in any upgrade function in the sequence, the upgrade transaction will roll back and db.open() will fail. This means that data will under no circumstances be left half-upgraded.

### Change Tracking

With Dexie it's possible to control and monitor each database change. No matter which method is being used for data manipulation, Dexie may tell whether a CREATE, UPDATE or DELETE is about to happen and offer the hook callbacks to manipulate the change if requested. It is also possible to hook into READ operations; to provide a proxy function that will be called whenever an object has been read from database and is about to be delivered to caller.

#### The CRUD Hooks ([CREATE](/docs/Table/Table.hook('creating')), [READ](/docs/Table/Table.hook('reading')), [UPDATE](/docs/Table/Table.hook('updating')), [DELETE](/docs/Table/Table.hook('deleting')))

CRUD hooks enable application code or addons to get involved in any of the CRUD operations taking place underhood. Whenever a database is about to be read from or modified, they allow hook implementation to modify what will happen, or just react on the event.

The CRUD hooks could be quite powerful. It is possible to write Dexie addons that perform synchronization, observation, custom advanced indexes, foreignKey implementations, views etc.

#### Hooks Documentation
* [hook('creating')](/docs/Table/Table.hook('creating'))
* [hook('reading')](/docs/Table/Table.hook('reading'))
* [hook('updating')](/docs/Table/Table.hook('updating'))
* [hook('deleting')](/docs/Table/Table.hook('deleting'))

### The [populate](/docs/Dexie/Dexie.on.populate) Event

In case your database needs initial data in order to work - data that must only be populated on database creation and never more, you can subscribe to the populate event. This will only be called in case the database is initially created - not when it is upgraded.

```javascript
var db = new Dexie("MyTicketDB");

db.version(1).stores({
    tickets: "++id,headline,description,statusId",
    statuses: "++id,name,openess"
});

db.on("populate", function() {
    // Init your DB with some default statuses:
    db.statuses.add({id: 1, name: "opened", openess: true});
    db.statuses.add({id: 2, name: "closed", openess: false});
    db.statuses.add({id: 3, name: "resolved", openess: false});
    db.statuses.add({id: 4, name: "wontfix", openess: false});
});
```

Here's also an example of how to populate data from an ajax call: [Ajax Populate Sample](/docs/Dexie/Dexie.on.populate#ajax-populate-sample) 

### Promises

Dexie comes with its own implementation of [Promise](/docs/Promise/Promise) based on [promise-light](https://github.com/taylorhakes/promise-light) by [Taylor Hakes](https://github.com/taylorhakes) that is Promise/A+ and ECMAScript 6 compliant. A Promise has a then() method which is called when operation completes or fails. The first argument to the then() method is the `complete` callback and the second is the `fail` callback. In ECMAScript 6, a catch() method is added as a shortcut for then(null, fn) - catching failures - this makes it possible to utilize then() as a success-method only and catch() as an error method only, making your code more readable. Dexie's implementation of Promise also has a finally() method that is called whether or not the operation fails or completes. All asynchronous methods in Dexie returns a Promise instance and this makes the API way more easy to use and makes error handling more robust.

How to use Promise line by line:

```javascript
var arrayPromise = db.friends.where('name').startsWithIgnoreCase('arnold').toArray();
arrayPromise.then(function(a) { console.log(a.length); });
arrayPromise.catch(function(err) { console.error(err); });
```

But Dexie gives you a little shortcut in all methods returning a promise with a value, so the above code will be equal to:

```javascript
db.friends.where('name').startsWithIgnoreCase('arnold').toArray(function(a) {
    console.log(a.length);
}).catch(function(err) {
    console.error(err);
});
```

_Note: Promises are returned from all methods in Dexie that perform asynchronous work. Also, most methods that has a value result, such as `toArray()`, also provide a shortcut for `then()` - you can pass in your callback directly to the method instead of calling then():
_

```javascript
db.friends.toArray().then (function (result) {});
```

is equivalent to:

```javascript
db.friends.toArray(function (result) {});
```

### Catching Certain Exception Classes

With Dexie's implementation of Promise.catch() enables you to catch certain exception classes as you would do on java or C#:

```javascript
db.friends.where('name').startsWithIgnoreCase('arnold').toArray(function(a) {
    console.log(a.length);
}).catch(DOMError, function(e) {
    console.error("DOMError occurred: " + err);
}).catch(TypeError, function(e) {
    console.error("TypeError occurred: " + err);
}).catch(function(err) {
    console.error("Unknown error occurred: " + err);
}).finally(function(){
    console.log("Finally the query succeeded or failed.");
});
```

##### More about Promises

* [http://www.html5rocks.com/en/tutorials/es6/promises/](http://www.html5rocks.com/en/tutorials/es6/promises/)
* [https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
* [http://promises-aplus.github.io/promises-spec/](http://promises-aplus.github.io/promises-spec/)

### WhereClause

You can retrieve objects from your [Table](/docs/Table/Table) instances using two methods:

* [Table.get()](/docs/Table/Table.get()) - retrieve an object by its primary key.
* [Table.where()](/docs/Table/Table.where()) - do an advanced query.

Example of a get() query:

```javascript
db.friends.get(2).then(function(friend) {
  console.log("Friend number 2: " + JSON.stringify(friend));
});
```

Example of a simple where() query:

```javascript
db.friends.where('shoeSize').above(37).count(function(count) {
    console.log("I have " + count + " friends with shoesize above 37!");
});
```

Example of an advanced where() query:

```javascript
db.friends.where('shoeSize')
    .between(37, 40)
    .or('name')
    .anyOf(['Arnold','Ingemar'])
    .and(function(friend) { return friend.isCloseFriend; })
    .limit(10)
    .each(function(friend){
        console.log(JSON.stringify(friend));
    });
```

### [AND](/docs/Collection/Collection.and()) and [OR](/docs/Collection/Collection.or())

Native indexedDB has no support for logical AND or OR operations. Dexie implements this in two different manner, which makes sense for their different purposes in regard to performance. Dexie implements logical OR by executing two different requests simultaneously and act on the union of these request (more about this in [this article](http://www.codeproject.com/Articles/744986/How-to-do-some-magic-with-indexedDB) ).

The `or()` method takes a string argument and then works the same as `where()`, whereas the `and()` method takes a function argument (a filter) and filters the results in an iteration sequence.

So why is and() and or() implemented differently? The reason is that:

* Logical OR _cannot_ be done by filtering - we must query the database with two queries to get it.
* We would gain no performance by letting the database handle Logical AND (launching two separate queries and the filter away entries that don't exist in both collections). The best pick for AND is undoubtedly a plain javascript filter. It also makes it obvious for the caller that it is important to pick a good index in the `where()` method and filter out the rest in the `and()` filter.

### [Back to Tutorial](/docs/Tutorial)
