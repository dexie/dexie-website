---
layout: docs
title: 'Dexie.delete()'
---

### Syntax

Delete database and leave it closed:
```js
db.delete();
```

Delete database and recreate it whenever the db instance is accessed again:
```js
db.delete({disableAutoOpen: false}); // dexie@4 or later
```

Delete another database (Static method):
```js
Dexie.delete('database_name');
```

### Return Value

[Promise](/docs/Promise/Promise)

### Description

Deletes the database. If the database does not exist (`db.open()` was never called) this method will also succeed.

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
