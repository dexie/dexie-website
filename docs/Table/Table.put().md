---
layout: docs
title: 'Table.put()'
---

Adds a new object to the object store or replaces an existing object in the object store.

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

If an object with the same primary key already exists, then it will be replaced with the given object. If the object does not exist, then it will be added.

The optional second *key* argument must only be used if the table uses [outbound keys](/docs/inbound#examples-of-outbound-primary-key). If providing the *key* argument on a table with [inbound](/docs/inbound) keys, then the operation will fail and the returned promise will be a rejection.

If the operation succeeds, then the returned Promise resolves to the key under which the object was stored in the table.

### See Also

[Table.update()](/docs/Table/Table.update())

[Table.add()](/docs/Table/Table.add())

[Collection.modify()](/docs/Collection/Collection.modify())
