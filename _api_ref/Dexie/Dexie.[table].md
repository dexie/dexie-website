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

### Sample

```javascript
var db = new Dexie("MyDB");
db.version(1).stores({friends: "++id,name,gender", pets: "++id,name,kind"});
db.open();

db.friends.add({name: "Simon", gender: "male"});
db.pets.add({name: "Josephina", kind: "dog"});
```
