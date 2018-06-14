---
layout: docs
title: 'Dexie.open()'
---

### Syntax

```javascript
db.open();
```

### Return Value

[Promise](/docs/Promise/Promise)<[Dexie](/docs/Dexie/Dexie)>

### Description

Open a database connection. 
After the call to open() you must not call [Dexie.version()](/docs/Dexie/Dexie.version()) anymore.
By default, db.open() will be called automatically on first query to the db.

This method is only needed if one of the following are true:
1. You've created Dexie with options `{ autoOpen: false }`
2. You've called db.close() or db.delete() on the same instance.

When open is called, your Dexie instance start interacting with the backend indexedDB code. In case upgrade is needed, your registered stores will be created or modified accordingly and any registered upgrader function will run. When all is finished the return Promise instance will resolve and any pending db operation you have initiated after the call to open() will resume. In case an error occur, the returned Promise will reject and any pending db operation will resume and fail too.

#### Dynamic Mode

If db.version() was never called prior to calling db.open(), the database will open in dynamic mode. This means that it will adapt to the current installed version.

### Sample

This samples shows how to open a database with a specified version.

```javascript
var db = new Dexie("FriendDatabase");
db.version(1).stores({friends: "++id,name,age,isCloseFriend"});
db.open().catch (function (err) {
    console.error('Failed to open db: ' + (err.stack || err));
});
    
// Even though open() is asynchronous,
// you can already now start interact with the database.
// The operations will be pending until open() completes.
// If open() succeeds, the operations below will resume.
// If open() fails, the below operations below will fail and
// their catch() blocks be called.
db.friends.add({name: "Josephine", age: 21, isCloseFriend: true}).then(function(){
    db.friends.where("name").equalsIgnoreCase("josephine").each(function(friend) {
        console.log("Found close friend: " + JSON.stringify(friend));
    });
}).catch(function (e) {
    // Something failed. It may be already in the open() call.
    console.error (e.stack || e);
});
```

### Sample (Dynamic Mode)

This sample shows how to open a database without specifying version.

```javascript
let db = await new Dexie("FriendDatabase").open();
console.log("Version", db.verno);
console.log("Tables", db.tables.map(({name, schema}) => ({
  name,
  schema
}));
```

### Dynamic Schema Manipulation

To change schema when using dynamic mode, you will have to close the database, define
a new version and reopen it. This may take a while as any ongoing transaction will have to
be waited for before the upgrade takes place.

```javascript

function changeSchema(db, schemaChanges) {
    db.close();
    const newDb = new Dexie(db.name);
    newDb.version(db.verno + 1).stores(schemaChanges);
    return newDb.open();    
}

// Open database dynamically:
async function playAround() {
    let db = new Dexie ('FriendsDatabase');
    if (!(await Dexie.exists(db.name))) {
        db.version(1).stores({});
    }
    await db.open();

    // Add a table with some indexes:
    db = await changeSchema(db, {friends: 'id, name'});

    // Add another index in the friends table
    db = await changeSchema(db, {friends: 'id, name, age'});

    // Remove the age index again:
    db = await changeSchema(db, {friends: 'id, name'})

    // Remove the friends table
    db = await changeSchema(db, {friends: null});
}

playAround().catch(err => console.error(err));

```
