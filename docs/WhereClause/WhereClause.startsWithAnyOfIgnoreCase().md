---
layout: docs
title: 'WhereClause.startsWithAnyOfIgnoreCase()'
---

_Since v1.3.0_

### Syntax

```javascript
table.where(indexOrPrimKey).startsWithAnyOfIgnoreCase(array) or
table.where(indexOrPrimKey).startsWithAnyOfIgnoreCase(str1, str2, strN, ...)
```

### Parameters

<table>
<tr><td>indexOrPrimKey: String</td><td>Name of an index or primary key registered in <a href="/docs/Version/Version.stores()">Version.stores()</a></td></tr>
<tr><td>array</td><td>Array of prefixes (strings) to look for</td></tr>
<tr><td>str1, str2, strN</td><td>Prefixes (strings) to look for</td></tr>
</table>

### Return Value

[Collection](/docs/Collection/Collection)

### Remarks

Searches given index for given prefixes, ignoring case differences.

### Sample

```javascript
// Define DB
var db = new Dexie("friendsDB");
db.version(1).stores({
    friends: '++id,fistName,lastName'
});

// Add some values
db.friends.bulkAdd([{
    firstName: "Fool",
    lastName: "Barfly"
},{
    firstName: "Bart",
    lastName: "Foofie"
}]).then(()=>{
  // Query values
  db.friends.where('lastName').startsWithAnyOfIgnoreCase(['foo','bar'])
    .toArray(function(result) {
        console.log("Found: " + result.lastName);
    });
});
```
