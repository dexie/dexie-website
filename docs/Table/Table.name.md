---
layout: docs
title: 'Table.name'
---

### Syntax

    table.name

### Type

[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)

### Sample

    var db = new Dexie("MyDB");
    db.version(1).stores({friends: "++id"});

    alert (db.friends.name); // Will alert ("friends");
