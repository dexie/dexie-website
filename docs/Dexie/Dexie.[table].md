---
layout: docs
title: 'Dexie.[table]'
---

### Syntax

```javascript
var db = new Dexie(dbName);
db.version(1).stores({table1: "...", table2: "..."});
db.open();

assert(db.table1 instanceof db.Table);
assert(db.table2 instanceof db.Table);
```

### Type

[Table](/docs/Table/Table)

### Notes

These dymanic properties only populated onto the db instance when declaring the schema using version().stores(). If you open the database dynamically (not using version().stores(), these properties are NOT populated and you need to wait for db.open() to complete before being able to access a table. Also when db.open() has completed, you will not have the `db[table]` properties but need to use [db.table()](Dexie.table()) to retrieve a table instance. You can then also use [db.tables](Dexie.tables) property to retrieve available tables after a successful call to db.open().
### Sample

```javascript
var db = new Dexie("MyDB");
db.version(1).stores({friends: "++id,name,gender", pets: "++id,name,kind"});
db.open();

db.friends.add({name: "Simon", gender: "male"});
db.pets.add({name: "Josephina", kind: "dog"});
```
