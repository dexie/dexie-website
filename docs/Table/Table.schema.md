---
layout: docs
title: 'Table.schema'
---

### Syntax

```javascript
db.[tableName].schema
```

### Type

[TableSchema](/docs/TableSchema)

### Sample

```javascript
var db = new Dexie("MyDB");
db.version(1).stores({friends: "++id,name"});

alert ("Primary key: " + db.friends.schema.primKey.keyPath); // Will alert ("id");
```
