---
layout: docs
title: 'Dexie.close()'
---

### Syntax

Close database and leave it closed:
```js
db.close();
```

Close database but reopen it whenever the db instance is accessed again (if it had default `autoOpen: true` in constructor):
```js
db.close({disableAutoOpen: false}); // dexie@4 or later
```

### Description

Closes the database. This operation completes immediately and there is no returned Promise.

### Remarks

In a typical web application, you would not need to think about calling this method as long as your app keeps a single instance of Dexie. Applications that create Dexie instance on demand must remember to close them when they are no longer needed in order to prevend resource leaks. This method can also be used in more advanced scenarios, such as unit testing or custom upgrade handling.

It is possible to reopen a closed database instance. This can be useful for testing the upgrade framework. You could do `db.close()`, then call `db.version(N)` to specify a new version of the database, and then do `db.open()` again.
