---
layout: docs
title: 'Table.where()'
---

Start filtering the object store by creating a [WhereClause](/docs/WhereClause/WhereClause) instance.

### Syntax

```javascript
// Dexie 1.x and 2.x:
table.where(indexOrPrimaryKey)

// Dexie 2.x only:
table.where(keyPathArray);
table.where({keyPath1: value1, keyPath2: value2, ...});
```

### Parameters
<table>
<tr><td>indexOrPrimaryKey: String</td><td>Name of an index or primary key registered in <a href="/docs/Version/Version.stores()">Version.stores()</a>. The special string ":id" represents the primary key.</td></tr>
  <tr>
    <td>keyPathArray</td>
    <td>(Dexie 2.x only) String identifying keyPaths to filter on. Must match a compound index or primary key.</td>
  </tr>
  <tr>
    <td>{keyPath1: value1, keyPath2: value2, ...}</td>
    <td>(Dexie 2.x only) Criterias to filter</td>
  </tr>
</table>

### Description

If a string, or array of strings was provided (indexes or primary keys), this method returns a [WhereClause](/docs/WhereClause/WhereClause) based on given index(es) or primary key(s). The returned WhereClause can be used to build a query on how to extract objects from the database using any of the methods in [WhereClause](/docs/WhereClause/WhereClause). An array of strings represents [compound indexes](/docs/Compound-Index).

If a plain object containing criterias was provided, this method returns a [Collection](/docs/Collection/Collection) filtered using given criterias. If providing a single criteria, the keyPath must match with an index. If providing multiple criterias, it is recommended to have a [compound index](/docs/Compound-Index) containing all of the keyPath (in arbitrary order), but it is not required. If no [compound index](/docs/Compound-Index), at least one of the keyPaths must match a simple index. If `Dexie.debug=true` and not having compound index of all provided keyPaths, a console.warn() will give a hint on how to index this query properly.

### Return Value

[WhereClause](/docs/WhereClause/WhereClause) if string was provided

[Collection](/docs/Collection/Collection) if object was provided.

### Sample

Find friends named david, ignoring case

```javascript
db.friends.where("name").equalsIgnoreCase("david").each(function (friend) {
    console.log("Found: " + friend.name + ". Phone: " + friend.phoneNumber);
}).catch(function (error) {
    console.error(error);
});
```

Find friends named David with age between 23 and 43

```javascript
db.friends.where(["name", "age"])
  .between(["David", 23], ["David", 43], true, true)
  .each(friend => {
      console.log("Found David, 43: " + JSON.stringify(friend));
  }).catch(error => {
      console.error(error.stack || error);
  });
```

Find a friend named David with age 43

```javascript
db.friends.where({name: "David", age: 43}).first(friend => {
    console.log("Found David, 43: " + JSON.stringify(friend));
}).catch(error => {
    console.error(error.stack || error);
});
```

### See Also

[WhereClause](/docs/WhereClause/WhereClause)

[Collection](/docs/Collection/Collection)

[API-Reference#query-items](/docs/API-Reference#query-items)
