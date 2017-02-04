---
layout: docs
title: 'Version'
---
An instance of a Version class can only be returned from the [Dexie.version()](Dexie.version()) method. Use it to define the schema and any upgrader function for that specific version.

### Sample

    var db = new Dexie("FriendsAndPetsDatabase");
    db.version(2).stores({
        friends: "++id,name,birthdate,sex",
        pets: "++id,name,kind"
    }).upgrade (function (trans) {
        var YEAR = 365 * 24 * 60 * 60 * 1000;
        trans.friends.each (function (friend, cursor) {
            friend.birthdate = new Date(Date.now() - (friend.age * YEAR));
            delete friend.age;
            cursor.update (friend);
        });
    });
    // Always keep the declarations previous versions as long as there might be users having them running.
    db.version(1).stores({
        friends: "++id,name,age,sex",
        pets: "++id,name,kind"
    });
    db.open(); 

### Methods

#### [stores()](Version.stores())
Specify the database schema (object stores and indexes) for a certain version.

#### [upgrade()](Version.upgrade())
Specify an upgrade function for upgrading between previous version to this one.

### See Also

#### [Database Versioning](Design#database-versioning)
