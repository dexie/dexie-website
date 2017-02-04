---
layout: docs
title: 'Dexie.tables'
---

### Syntax

```javascript
var db = new Dexie(dbName);
db.version(1).stores({table1: "...", table2: "..."});
db.open();

db.tables.forEach(function (table) {
    assert (table === db[table.name]);
});
```

### Type

Array&lt;[Table](/docs/Table/Table)&gt;

### Sample

```javascript
var db = new Dexie("MyDB");
db.version(1).stores({friends: "++id,name,gender", pets: "++id,name,kind"});
db.open();

// Output the schema of each table:
db.tables.forEach(function (table) {
    console.log("Schema of " + table.name + ": " + JSON.stringify(table.schema));
});
```
