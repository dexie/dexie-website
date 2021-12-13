---
layout: docs
title: 'Dexie.verno'
---

### Syntax

```javascript
db.verno
```

### Type

Number (readonly)

### Description

Version number of the database (read-only). If [db.version()](/docs/Dexie/Dexie.version()) has been used to specify versions and schemas, this property will contain the highest value of the registered versions. If opening the database without specifying [db.version()](/docs/Dexie/Dexie.version()) and schemas, the database will read the version of the existing database.

Note that if you are opening a bare-bone indexedDB database that was not created via Dexie, you will notice a that the version number returned by this property will be the native version divided by 10. This is due to that [Dexie.version()](/docs/Version/Dexie.version()) multiplies the given version number by 10. See [Issue #59](https://github.com/dexie/Dexie.js/issues/59) where the reason for this behavior is described.


