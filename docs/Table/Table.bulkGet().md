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

Requests the objects of the given keys and returns a Promise that resolves with an array of results. The resulting array will always have the same length as the given array of keys. Every position in given key array will correspond to the same position in the resulting array.

For those keys that does not exist in the database, undefined will be returned in their place.

### See also

[Table.bulkAdd()](/docs/Table/Table.bulkAdd())

[Table.bulkPut()](/docs/Table/Table.bulkPut())

[Table.bulkDelete()](/docs/Table/Table.bulkDelete())
