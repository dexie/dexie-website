---
layout: docs
title: 'Dexie.delete()'
---

### Syntax

```javascript
db.delete();
// Static method
Dexie.delete('database_name');
```

### Return Value

[Promise](/docs/Promise/Promise)

### Description

Deletes the database and calls the `then()` method of the returned Promise when done. If the database does not exist (`db.open()` was never called) this method will also succeed.

### Sample

```javascript
db.delete().then(() => {
    console.log("Database successfully deleted");
}).catch((err) => {
    console.error("Could not delete database");
}).finally(() => {
    // Do what should be done next...
});
```
