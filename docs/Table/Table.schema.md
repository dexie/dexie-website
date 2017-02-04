---
layout: docs
title: 'Table.schema'
---

### Syntax

    db.[tableName].schema

### Type

[TableSchema](TableSchema)

### Sample

    var db = new Dexie("MyDB");
    db.version(1).stores({friends: "++id,name"});

    alert ("Primary key: " + db.friends.schema.primKey.keyPath); // Will alert ("id");
