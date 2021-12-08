---
layout: docs
title: 'Dexie.table()'
---

### Syntax

```javascript
db.table(storeName)
```

### Parameters
<table>
  <tr>
    <td>storeName : String</td>
    <td>The name of the store to retrieve</td>
  </tr>
</table>

### Return Value

[Table](/docs/Table/Table)

### Remarks

Returns a [Table](/docs/Table/Table) instance representing the object store with the given name. If database is opened with a defined schema (using db.version().stores()), this method can be called before database has been opened, but if not defining a schema, tables are not accessible until database has been successfully opened. See [Dexie.open()](https://dexie.org/docs/Dexie/Dexie.open())

