---
layout: docs
title: 'Dexie.open()'
---

### Syntax

    db.open();

### Return Value

[Promise](Promise)<[Dexie](Dexie)>

### Description

Open a database connection. 
After the call to open() you must not call [Dexie.version()](Dexie.version()) anymore.
By default, db.open() will be called automatically on first query to the db.

This method is only needed if one of the following are true:
1. You've created Dexie with options { autoOpen: false }
2. You've called db.close().

When open is called, your Dexie instance start interacting with the backend indexedDB code. In case upgrade is needed, your registered stores will be created or modified accordingly and any registered upgrader function will run. When all is finished the return Promise instance will resolve and any pending db operation you have initiated after the call to open() will resume. In case an error occur, the returned Promise will reject and any pending db operation will resume and fail too.

### Sample

```javascript
var db = new Dexie("FriendDatabase", {autoOpen: false});
db.version(1).stores({friends: "++id,name,age,isCloseFriend"});
db.open().catch (function (err) {
    console.error('Failed to open db: ' + (err.stack || err));
});
    
// Even though open() is asynchronic, you can already now start interact with the database.
// The operations will be pending until open() completes. If open() succeeds, the operations below 
// will resume. If open() fails, the below operations below will fail and their catch() blocks be
// called.
db.friends.add({name: "Josephine", age: 21, isCloseFriend: true}).then(function(){
    db.friends.where("name").equalsIgnoreCase("josephine").each(function(friend) {
        console.log("Found close friend: " + JSON.stringify(friend));
    });
}).catch(function (e) {
    console.error (e.stack || e); // Something failed. It may be already in the open() call.
});
```
