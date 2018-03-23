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

This method is an extension to the native indexedDB API which does not support listing of database names. Chrome and Opera has implemented webkitGetDatabaseNames() but neither IE, Edge, Mozilla or Safari supports it. This method will check if webkitGetDatabaseNames() is present and use it if so. Otherwise it will return a list maintained by Dexie by using a dedicated database for keeping track of other database names.

This means that on Opera and Chrome, the method will work no matter if the database was created using Dexie or not, but on IE and Firefox, the method will only see databases created using Dexie.

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

This code will not work on Dexie 2.x due that localStorage is no longer used to keep track of database names. A future version of Dexie may enable a Dexie event to subscribe to for the same purpose that would work the same as before. If this is of interest for you, please file an issue and we'll try fix it.
