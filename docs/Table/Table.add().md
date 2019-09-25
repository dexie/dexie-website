---
layout: docs
title: 'Table.add()'
---

Adds an object to the object store.

### Syntax

```javascript
table.add(item, [key])
```

### Parameters

<table>
<tr><td>item</td><td>Object to add</td><td></td></tr>
<tr><td>key</td><td>Primary key</td><td><i>optional</i></td></tr>
</table>

### Return Value

[Promise](/docs/Promise/Promise)

### Remarks

Add given object to store. If an object with the same primary key already exist, the operation will fail and returned promise [catch()](/docs/Promise/Promise.catch()) callback will be called with the error object. If the operation succeeds, the returned promise [then()](/docs/Promise/Promise.then()) callback receives the result of the `add` request on the object store, the id of the inserted object.

The optional second *key* argument must only be used if your table uses [non-inbound keys](https://dexie.org/docs/inbound#example-of-non-inbound-primary-key). If providing the key argument on a table with [inbound](https://dexie.org/docs/inbound) keys, the operation will fail and the returned promise will be a rejection.

### See Also

[Table.put()](/docs/Table/Table.put())
