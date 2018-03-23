---
layout: docs
title: 'Table.delete()'
---

Delete object from store.

### Syntax

```javascript
table.delete(primaryKey)
```

### Parameters

<table>
<tr><td>primaryKey</td><td>Primary key of the object to delete</td></tr>
</table>

### Return Value

[Promise](/docs/Promise/Promise) that resolves successfully with an undefined result, no matter if a record was deleted or not. Rejection happens if the provided key is not a valid key (not a Number, String, Date or Array<Number \| String \| Date>) or if the current transaction is readonly or inactive.

### Remarks

Deletes the object and resolves or rejects the returned promise when done.

### See Also

[Collection.delete()](/docs/Collection/Collection.delete())

[Table.clear()](/docs/Table/Table.clear())

[Dexie.delete()](/docs/Dexie/Dexie.delete())

