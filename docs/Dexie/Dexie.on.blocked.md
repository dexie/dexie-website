---
layout: docs
title: 'Dexie.on.blocked'
---

### Syntax

```javascript
db.on("blocked", function () {});
```

### Description

The "blocked" event occurs if database upgrade is blocked by another tab or browser window keeping a connection open towards the database. Note that before this event is triggered, the other window is triggered with the "versionchange" event. Only if the other window doesn't respond by closing it's DB connection, this "blocked" event will occur.

By default, Dexie will close any connection and console.warn() when a "versionchange" event occurs, so if you're only using Dexie to open your database and not override the default behaviour of the ["versionchange"](/docs/Dexie/Dexie.on.versionchange) event, this event will unlikely happen unless a page has hanged or is slow to respond.

When the blocked event occur, the upgrade transaction has not yet failed. The upgrading will resume as soon as the blocker releases the database.

### Sample

```javascript
var db = new Dexie("MyDB");
db.on("blocked", function() {
    alert ("Database upgrading was blocked by another window. " +
           "Please close down any other tabs or windows that has this page open");
});
```
