---
layout: docs
title: 'Version.upgrade()'
---

### Syntax

```javascript
version.upgrade (upgraderFunction);
```

### Parameters
<table>
  <tr>
    <td>upgraderFunction</td>
    <td>Callback function with signature <code>function(transaction){}</code> where <code>transaction</code> is an instance of <code>Transaction</code></td>
  </tr>
</table>

### Return Value

[Version](/docs/Version/Version)

### Sample

```javascript
var db = new Dexie("FriendsAndPetsDatabase");

db.version(1).stores({
    friends: "++id,name,age,sex"
});

db.version(2).stores({
    friends: "++id,name,birthdate,sex"
}).upgrade (trans => {
    var YEAR = 365 * 24 * 60 * 60 * 1000;
    return trans.table("friends").toCollection().modify (friend => {
        friend.birthdate = new Date(Date.now() - (friend.age * YEAR));
        delete friend.age;
    });
});

```

### See Also

[Database Versioning](/docs/Tutorial/Design#database-versioning)
