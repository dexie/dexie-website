---
layout: docs
title: 'Table.where()'
---

Start filtering the object store by creating a [WhereClause](/docs/WhereClause/WhereClause) instance.

### Syntax

```javascript
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

### Samples

#### Find friends named david, ignoring case

```javascript
const friends = await db.friends.where("name").equalsIgnoreCase("david").toArray();
for (const friend of friends) {
  console.log("Found: " + friend.name + ". Phone: " + friend.phoneNumber);
}
```

#### Find friends named David with age between 23 and 43 (two criterias)

```javascript
const davids = await db.friends.where(["name", "age"])
  .between(["David", 23], ["David", 43], true, true)
  .toArray();
for (const david of davids) {
  console.log(`Found a David with age ${david.age}`);
}
```
*NOTE: This example uses [compound index](https://dexie.org/docs/Compound-Index) '[name+age]' to squeeze the most performance out of IndexedDB in finding records with multiple criterias. Not all types of criterias can be filtered this way, but combinations of a range in the last part and equals on the first parts works.* 


#### Find a friend named David with age 43

```javascript
const david43 = await db.friends.where({name: "David", age: 43}).first();
```
The above statement is equivalent to:
```javascript
const david43 = await db.friends.get({name: "David", age: 43});
```


### See Also

[WhereClause](/docs/WhereClause/WhereClause)

[Collection](/docs/Collection/Collection)

[API-Reference#query-items](/docs/API-Reference#query-items)

[Table.get()](/docs/Table/Table.get())

