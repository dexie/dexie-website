---
layout: docs
title: 'Dexie.on.versionchange'
---

### Syntax

```javascript
db.on("versionchange", function (event) {});
```

### Description

The "versionchange" event occurs if another indexedDB database instance needs to upgrade or delete the database. If you do not subscribe to this event, Dexie has a built-in default implementation that will close the database immediately and log to console. This will resume the upgrading process of the other page.

To override the default behavior, your subscriber function must return false.

### NOTE

After an upgrade has been made from another window, your current window will run on code that targets an old database schema. Your app will not know what tables there are and how to use the database in this newer version. Therefore, a webapp should typically update itself when this event occurs. For a single-page application this normally means reloading the current location to refresh the HTML and JS code from server.

### Sample

```javascript
var db = new Dexie("MyDB");
db.on("versionchange", function(event) {
  if (confirm ("Another page tries to upgrade the database to version " +
                event.newVersion + ". Accept?")) {
    // Refresh current webapp so that it starts working with newer DB schema.
    window.location.reload();
  } else {
    // Will let user finish its work in this window and
    // block the other window from upgrading.
    return false;
  }
});
```
