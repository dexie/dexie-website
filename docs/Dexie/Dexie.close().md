---
layout: docs
title: 'Dexie.close()'
---

### Syntax

```javascript
db.close();
```

### Description

Closes the database. This operation completes immediately and there is no returned Promise.

#### Remarks

In a typical web application, you would not need to think about calling this method. It can be used in more advanced scenarios, such as unit testing or custom upgrade handling.

It is possible to reopen a closed database instance. This can be usedful for testing the upgrade framework. You could do `db.close()`, then call `db.version(N)` to specify a new version of the database, and then do `db.open()` again.
