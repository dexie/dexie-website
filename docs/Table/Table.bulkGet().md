---
layout: docs
title: 'Table.bulkGet()'
---

*Since v3.0.0-alpha.8*

### Syntax

```javascript
db.table.bulkGet(keys)
```

### Parameters

<table>
<tr><td>keys</td><td>Array of primary keys of the objects to retrieve</td></tr>
</table>

### Return Value

[Promise](/docs/Promise/Promise)

### Remarks

Request an array of keys and retrieve a Promise of an array of results. The resulting array will always have the same length as the given array of keys. Every position in given key array will correspond to the same position in the resulting array.

For those keys that does not exist in the database, undefined will be returned in their place.

### Example

```javascript

async function test() {
  await db.friends.bulkAdd([{id: 1, name: "Foo"}, {id: 2, name: "Bar"}]);
  const [foo, nonExisting, bar] = await db.friends.bulkGet([1, 777, 2]);
  assert (foo.name === "Foo");
  assert (bar.name === "Bar");
  assert (nonExisting === undefined);
}

```

### See also

[Table.bulkAdd()](/docs/Table/Table.bulkAdd())

[Table.bulkPut()](/docs/Table/Table.bulkPut())

[Table.bulkDelete()](/docs/Table/Table.bulkDelete())
