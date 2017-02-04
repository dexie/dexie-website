---
layout: docs
title: 'Dexie'
---

Dexie.js (Official home page: [dexie.org](http://dexie.org)) is a library that makes it super simple to use [indexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API) - the standard client-side database in browsers. Read more about dexie on it's [README](https://github.com/dfahlander/Dexie.js/blob/master/README.md) or at the [home page](http://dexie.org).

`Dexie` is the main class and the default export of the library. An instance of this class represents an indexedDB database connection.

### Syntax
```javascript
var db = new Dexie (databaseName, options?);
```

### Parameters
<table>
<tr><td>dbName : String</td><td>Database name</tdAPIr>
<tr><td>options: Object (optional)</td><td>Options</td></tr>
</table>

### Options

<table>
<tr><td>addons: Array&lt;DexieAddon&gt;</td><td>Explicitly define the addons to activate for this db instance</td></tr>
<tr><td>autoOpen: boolean</td><td>Default true. Whether database will open automatically on first query.</td></tr>
<tr><td>indexedDB: <a href="https://developer.mozilla.org/en-US/docs/Web/API/IDBFactory">IDBFactory</a></td><td>Supply an alternate implementation of indexedDB. If supplying this, also supply IDBKeyRange that works with that implementation.</td></tr>
<tr><td>IDBKeyRange: <a href="https://developer.mozilla.org/en-US/docs/Web/API/IDBKeyRange">IDBKeyRange</a></td><td>An implementation of the IDBKeyRange interface that works with provided indexedDB implementation.</td></tr>
</table>

If the 'addons' option is omitted, it will default to the value of [Dexie.addons](Dexie.addons).

### Return Value

[Dexie](Dexie)

### Sample

```javascript
// Declare db instance
var db = new Dexie("MyDatabase");

// Define Database Schema
db.version(1).stores({
    friends: "++id, name, age, isCloseFriend",
    notes: "++id, title, date, *items"
});

// Interact With Database
db.transaction('rw', db.friends, db.notes, function* () {

    // Let's add some data to db:
    var friend1Id = yield db.friends.add({name: 'Camilla', age: 25, isCloseFriend: 1});
    var friend2Id = yield db.friends.add({name: 'Ban Ki-moon', age: 70, isCloseFriend: 0});

    var noteId = yield db.notes.add({
        title: 'Shop tomorrow',
        date: new Date(),
        items: ['milk', 'butter']
    });

    // Let's query the db
    var closeFriends = yield db.friends
        .where('isCloseFriend').equals(1)
        .toArray();

    console.log("Close friends:" + closeFriends.map(f => f.name));

    var toShop = yield db.notes
        .where('title').startsWithIgnoreCase ('shop')
        .toArray();

    console.log("Shopping list: " + toShop.map(note => note.items));

}).catch(function(err) {

    // Catch any error event or exception and log it:
    console.error(err.stack || err);

});
```
[Open sample in jsfiddle](https://jsfiddle.net/dfahlander/qmr9L6L8/)

### Sample: Open existing database 'as is'

```javascript
new Dexie('MyDatabase').open().then(function (db) {
    console.log ("Found database: " + db.name);
    console.log ("Database version: " + db.verno);
    db.tables.forEach(function (table) {
        console.log ("Found table: " + table.name);
        console.log ("Table Schema: " +
            JSON.stringify(table.schema, null, 4));
    });
}).catch('NoSuchDatabaseError', function(e) {
    // Database with that name did not exist
    console.error ("Database not found");
}).catch(function (e) {
    console.error ("Oh uh: " + e);
});
```
[Open sample in jsfiddle](https://jsfiddle.net/dfahlander/b8Levamm/)

### Sample: Instantiate a Dexie with custom addon
```javascript

// Define the addon
function myForEachAddon(db) {
    db.Collection.prototype.forEach = function (callback) {
        // Make the forEach() method just an alias of the existing
        // each() method:
        return this.each(callback);
    });
}
// Register it (optional)
Dexie.addons.push(myForEachAddon);


// Use it:
var db = new Dexie('dbname');
db.version(1).stores({friends: 'name'});
db.transaction('rw', db.friends, function () {
    db.friends.clear();
    db.friends.bulkAdd([{name: "Foo"},{name: "Bar"}]);
}).then(function() {
    db.friends
      .where('name')
      .anyOfIgnoreCase('foo','bar')
      .forEach(friend => {
          console.log(friend.name);
      });
}).catch(ex => {
    console.error(ex);
});

```

How *options* tells how to apply addons:
```javascript
// Open normally. Registered addons will be invoked automatically.
var db1 = new Dexie('dbname');

// Explicitely tell Dexie to ignore registered addons:
var db2 = new Dexie('dbname', {addons: []});

// Explicitely tell Dexie to use just your set of addons:
var db3 = new Dexie('dbname', {addons: [myForEachAddon]});

```

### Methods

#### [version()](Dexie.version())
Specify the database schema (object stores and indexes) for a certain version.

#### [on()](Dexie.on())
Subscribe to events

#### [open()](Dexie.open())
Open database and make it start functioning.

#### [table()](Dexie.table())
Returns an object store to operate on

#### [transaction()](Dexie.transaction())
Start a database transaction

#### [close()](Dexie.close())
Close the database

#### [delete()](Dexie.delete())
Delete the database

#### [isOpen()](Dexie.isOpen())
Returns true if database is open.

#### [hasFailed()](Dexie.hasFailed())
Returns true if database failed to open.

#### [backendDB()](Dexie.backendDB())
Returns the native IDBDatabase instance.

#### [vip()](Dexie.vip())
Enable on('ready') subscribers to use db before open() is complete.

### Properties

#### [name](Dexie.name)
The database name.

#### [&#91;table&#93;](Dexie.[table])
Each object store defined in [version().stores()](Version.stores()) gets a [Table](Table) instance named by the object store.

#### [tables](Dexie.tables)
Javascript Array containing all Table instances.

#### [verno](Dexie.verno)
Version of current database

#### Static Methods

#### [Dexie.async()](Dexie.async())
Declare an async function in today's modern browsers (2015) without the need for a transpiler.

#### [Dexie.spawn()](Dexie.spawn())
Spawn an async function in today's modern browsers (2015) without the need for a transpiler.

#### [Dexie.delete()](Dexie.delete())
Delete a database.

#### [Dexie.getDatabaseNames()](Dexie.getDatabaseNames())
List all database names at current origin.

#### [Dexie.exists()](Dexie.exists())
Detect whether a database with the given name exists.

#### [Dexie.getByKeyPath()](Dexie.getByKeyPath())
Retrieve a property from an object given a key path.

#### [Dexie.setByKeyPath()](Dexie.setByKeyPath())
Modify a property in an object given a key path and value.

#### [Dexie.delByKeyPath()](Dexie.delByKeyPath())
Delete a property from an object given a key path.

#### [Dexie.shallowClone()](Dexie.shallowClone())
Shallow clones an object.

#### [Dexie.deepClone()](Dexie.deepClone())
Deep clones an object.

#### [Dexie.ignoreTransaction()](Dexie.ignoreTransaction())
Create a a new scope where current transaction is ignored.

#### [Dexie.override()](Dexie.override())
Override existing method and be able to call the original method.

#### [Dexie.defineClass()](Dexie.defineClass())
Creates a function and populates its prototype with given structure.

#### [Dexie.derive()](Dexie.derive())
Fixes the prototype chain for OOP inheritance.

#### [Dexie.extend()](Dexie.extend())
Set given additional properties into given object.

#### [Dexie.Events()](Dexie.Events())
Create a set of events to subscribe to and fire.

### Static Properties

#### [addons](Dexie.addons)
Array of extended constructors.

#### [debug](Dexie.debug)
Get / set debug mode.

#### [semVer](Dexie.semVer)
Contains the semantic version string from package.json.

#### [version](Dexie.version)
Contains the version number of Dexie as a numeric comparable decimal value.

