---
layout: docs
title: 'Dexie.exists()'
---

### Syntax

```javascript
Dexie.exists(dbName)
```

### Return Value

[Promise&lt;boolean&gt;](/docs/Promise/Promise) 

### Description

Checks whether a database with the given name exists or not. Returns a Promise that resolves with true or false.

**IMPORTANT NOTICE**

You normally won't need this method! Dexie will automatically detect if database creation or upgrade is needed. The following checks are made withing `db.open()`:
* If database does not exists, Dexie will create it automatically.
* If database exists but on a previous version, Dexie will upgrade it for you.
* If database exists on the declared version, Dexie will just open it for you.

So, DON'T do stuff like:

```javascript
Dexie.exists('my-database').then(function (exists) {
    if (!exists) {
        var db = new Dexie('my-database');
        db.version(1).stores(...);
        db.open();
    }
});
```

It's simply NOT needed. Instead, just do:

```javascript
var db = new Dexie('my-database');
db.version(1).stores(...);
db.open().catch(function (err) {
    console.error (err.stack || err);
});
```
...and it will create the db when needed but just open it if not needing to create it.

### Sample

As stated out in the 'IMPORTANT NOTICE' above, this method is never needed in normal scenarios. But if you of some reason just want to find out if a database exists without actually using it, you could do something like the following:

```javascript
Dexie.exists("myDatabase").then(function(exists) {
    if (exists)
        console.log("Database exists");
    else
        console.log("Database doesn't exist");
}).catch(function (error) {
    console.error("Oops, an error occurred when trying to check database existence");
});
```
