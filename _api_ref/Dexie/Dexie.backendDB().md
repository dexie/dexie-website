---
layout: docs
title: 'Dexie.backendDB()'
---

### Syntax

```javascript
var idb_db = db.backendDB();
```

### Return Value

[IDBDatabase](https://developer.mozilla.org/en-US/docs/Web/API/IDBDatabase)

### Description

Returns the native IndexedDB database instance. 

### Sample

```javascript
var db = new Dexie("MyDB");
db.version(1).stores({items: "++id"});
db.open().then(function(){
    // Now when database is opened, the native DB instance is on place.
    // Lets play with the native interface here:
    var idb = db.backendDB();
    var idbtrans = idb.transaction (['items'], 'readonly');
    var itemsStore = idbtrans.objectStore('items');
    var req = itemsStore.get(2);
    req.onsuccess = function () {
        if (req.result)
            alert ("Got item 2: " + JSON.stringify(req.result));
        else
            alert ("Item 2 not found");
    };
});
```
