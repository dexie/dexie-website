---
layout: docs
title: 'Table.put()'
---

Adds new or replaces existing object in the object store.

### Syntax

```javascript
table.put(item, [key])
```

### Parameters
<table>
  <tr>
    <td>item</td>
    <td>Object to add</td>
    <td></td>
  </tr>
  <tr>
    <td>key</td>
    <td>Primary key</td>
    <td><i>optional</i></td>
  </tr>
</table>

### Return Value

[Promise](Promise)

### Remarks

If an object with the same primary key already exist, it will be replaced with the given object. If it does not exist, it will be added.

If the operation succeeds then the returned Promise resolves to the key under which the object was stored in the Table.

### See Also
[Table.update()](Table.update())

[Table.add()](Table.add())

[Collection.modify()](Collection.modify())
