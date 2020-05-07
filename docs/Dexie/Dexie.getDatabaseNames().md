---
layout: docs
title: 'Dexie.getDatabaseNames()'
---

### Syntax

```javascript
const promise = Dexie.getDatabaseNames([callback]);
```

### Return Value

[Promise<string[]>](/docs/Promise/Promise)

### Parameters

 * callback - Just a shortcut for Dexie.getDatabaseNames().then(callback)

### Description

Returns an array of database names at current host.

### Sample

```javascript
const databases = await Dexie.getDatabaseNames();
console.log(databases);
```

### Browser Specific Info

This method is an extension to the native indexedDB API which does not support listing of database names. Chrome and Opera did have a native API we could use, webkitGetDatabaseNames() but since Chrome release 60 (2018), this API was removed. Dexie prior to version 3.0.1, tried to use webkitGetDatabaseNames() if present. A newer API has arrived since then, IDBFactory.databases(), used by newest Chromium browsers. From Dexie 3.0.1 and forward, Dexie tries to use that new API to list database names if present. If the API is not present, it will fallback to its own tracking of database names (tracked in a database named `__dbnames`).

### Detecting When Databases Are Added Or Deleted

In earlier versions of Dexie, it was possible to listen to changes on added/removed database names by using the following piece of code:

```javascript
window.addEventListener('storage', function (event) {
    if (event.key === "Dexie.DatabaseNames") {
        console.log("A database was added or removed");
        console.log("Old list: " + event.oldValue);
        console.log("New list: " + event.newValue);
    }
});
```

This code will not work on Dexie 2.x or 3.x due that localStorage is no longer used to keep track of database names. A future version of Dexie may enable a Dexie event to subscribe to for the same purpose that would work the same as before. If this is of interest for you, please file an issue and we'll try fix it.
