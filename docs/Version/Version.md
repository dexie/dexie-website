---
layout: docs
title: 'Version'
---

An instance of a Version class can only be returned from the [Dexie.version()](/docs/Dexie/Dexie.version()) method. Use it to define the schema and any upgrader function for that specific version.

### Sample

```javascript
var db = new Dexie("FriendsAndPetsDatabase");
db.version(2).stores({
  friends: "++id,name,birthdate,sex",
  pets: "++id,name,kind"
}).upgrade (trans => {
  var YEAR = 365 * 24 * 60 * 60 * 1000;
  return trans.friends.toCollection().modify (friend => {
    friend.birthdate = new Date(Date.now() - (friend.age * YEAR));
    delete friend.age;
  });
});
// Always keep the declarations previous versions as long as there might be users having them running.
db.version(1).stores({
  friends: "++id,name,age,sex",
  pets: "++id,name,kind"
});
db.open(); 
```

## Methods

### [stores()](/docs/Version/Version.stores())
Specify the database schema (object stores and indexes) for a certain version.

### [upgrade()](/docs/Version/Version.upgrade())
Specify an upgrade function for upgrading between previous version to this one.

## See Also

[Database Versioning](/docs/Tutorial/Design#database-versioning)
