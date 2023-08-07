---
layout: docs
title: 'Collection.each()'
---

### Syntax

```javascript
collection.each(callback)
```

### Parameters

<table>
  <tr>
    <td>callback: Function</td>
    <td><code>function (item, cursor) { }</code></td>
  </tr>
</table>

### Callback Parameters

<table>
  <tr>
    <td>item: Object</td>
    <td>Found object</td>
  </tr>
  <tr>
    <td>cursor: <a href="https://developer.mozilla.org/en-US/docs/Web/API/IDBCursor"><code>IDBCursor</code></a></td>
    <td>The cursor of the object being iterated.</td>
  </tr>
</table>

### Return Value

[Promise](/docs/Promise/Promise)

### Remarks

Iterate through all objects in the collection in an implicit single readonly [transaction](https://dexie.org/docs/Dexie/Dexie.transaction()). If you need to modify or delete items from within the callback, you could use [Collection.modify()](https://dexie.org/docs/Collection/Collection.modify()) in place of Collection.each(), since it will use a readwrite transaction rather than a readonly transaction. You could also explicitly surround your call in a [READWRITE transaction](https://dexie.org/docs/Dexie/Dexie.transaction()).

When iteration finishes, the returned Promise will resolve with `undefined`, calling any [Promise.then()](/docs/Promise/Promise.then()) callback.

If the operation fails, the returned Promise will be rejected, calling any [Promise.catch()](/docs/Promise/Promise.catch()) callback.

### NOTES:
* The operation will implicitly be called from within a READONLY transaction unless you already surround your code with a transaction.
* The callback should not modify the database. If that is required, use [Collection.modify()](https://dexie.org/docs/Collection/Collection.modify()) instead.
* The return value from your callback is ignored, so returning a Promise from it will have no effect.
* In many cases, it is better and more optimized to use any of the following methods when reading from a Table or Collection:
  * [Collection.toArray()](/docs/Collection/Collection.toArray())
  * [Collection.primaryKeys()](/docs/Collection/Collection.primaryKeys())
  * [Collection.keys()](/docs/Collection/Collection.keys())

### Sample

```javascript
const db = new Dexie('dbname');

db.version(1).stores({
  friends: `
    id,
    name,
    age`
});

// Populate table
db.friends.bulkPut([
  {id: 1, name: "Foo", age: 33},
  {id: 2, name: "Bar", age: 44},
  {id: 3, name: "Someone", age: 1}
]).then(() => {
  // Iterate all friends, ordered by id:
  console.log("All my friends, ordered by id:");
  return db.friends.each(friend => console.log(friend.name));
}).then(() => {
  // Iterate all friends, ordered by age:
  console.log("All my friends, ordered by age:");
  return db.friends.orderBy('age').each(friend => console.log(friend.name));
}).then(() => {
  // Iterate all friends where age is above 30.
  console.log("Friends over 30 years old:");
  return db.friends.where('age').above(30).each(friend => console.log(friend.name));
}).catch (err => {
  console.error (err);
});

```
