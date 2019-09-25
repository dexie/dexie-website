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

[Promise](/docs/Promise/Promise)

### Remarks

If an object with the same primary key already exists, it will be replaced with the given object. If it does not exist, it will be added.

The optional second *key* argument must only be used if your table uses [non-inbound keys](https://dexie.org/docs/inbound#example-of-non-inbound-primary-key). If providing the key argument on a table with [inbound](https://dexie.org/docs/inbound) keys, the operation will fail and the returned promise will be a rejection.

If the operation succeeds then the returned Promise resolves to the key under which the object was stored in the Table.

### See Also

[Table.update()](/docs/Table/Table.update())

[Table.add()](/docs/Table/Table.add())

[Collection.modify()](/docs/Collection/Collection.modify())
