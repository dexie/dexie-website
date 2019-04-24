---
layout: docs
title: 'Table.bulkDelete()'
---

*Since v1.3.6*

### Syntax

```javascript
db.table.bulkDelete(keys)
```

### Parameters

<table>
<tr><td>keys</td><td>Array of primary keys of the objects to delete</td></tr>
</table>

### Return Value

[Promise](/docs/Promise/Promise)

### Remarks

Deletes given keys and returns a Promise that resolves when keys are deleted.

### See also

[Table.bulkGet()](/docs/Table/Table.bulkGet())

[Table.bulkAdd()](/docs/Table/Table.bulkAdd())

[Table.bulkPut()](/docs/Table/Table.bulkPut())

[Table.delete()](/docs/Table/Table.delete())

[Collection.delete()](/docs/Collection/Collection.delete())
